import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { OCEAN_LOCATIONS, ARGO_FLOATS } from './src/data/oceanData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to instantiate Gemini client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Generate concise dataset summaries for system prompt grounding
const DATASET_SUMMARY = OCEAN_LOCATIONS.map((loc) => {
  return `- ${loc.name} (${loc.type}, ${loc.nearestOcean}): Temp=${loc.avgTemp}°C, Salinity=${loc.avgSalinity} PSU, Depth=${loc.avgDepth}m, Pressure=${loc.avgPressure} dbar, Current=${loc.currentSpeed}, HealthScore=${loc.healthScore}/100, ActiveFloats=[${loc.argoFloatIds?.join(', ') || 'None'}]. Key Insights: ${loc.insights?.slice(0, 2).join('; ')}`;
}).join('\n');

const FLOATS_SUMMARY = ARGO_FLOATS.map((f) => {
  return `- Float #${f.code} ("${f.name}"): Ocean=${f.ocean}, Nearest=${f.nearestCity || 'Open Ocean'}, Depth=${f.depth}m, Temp=${f.temp}°C, Salinity=${f.salinity} PSU, Battery=${f.battery}%, Status=${f.status}, Last Surface=${f.lastSurface}`;
}).join('\n');

// 1. AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, locationContext, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Intelligent fallback if API key is not configured
      const reply = generateSmartFallbackChat(message, locationContext);
      return res.json({ reply });
    }

    const systemInstruction = `You are FloatChat AI, an authoritative, world-class satellite oceanographer and ARGO float telemetry scientist powered by NASA, NOAA, INCOIS, and global data centers.

YOUR ABSOLUTE MANDATE:
Provide 100% accurate, scientifically rigorous, and data-grounded answers. Never invent numbers or facts that contradict the ground-truth database below.

GROUND-TRUTH OCEAN SECTORS & CITIES TELEMETRY DATABASE (18 LOCATIONS):
${DATASET_SUMMARY}

GROUND-TRUTH ARGO FLOAT TELEMETRY INDEX:
${FLOATS_SUMMARY}

CURRENTLY SELECTED USER LOCATION CONTEXT:
${locationContext ? JSON.stringify(locationContext, null, 2) : 'None (Global Overview Selected)'}

CORE OCEANOGRAPHIC REFERENCE & METRIC RULES:
1. Sea Surface Temperature (SST): Warmest in Red Sea (30.2°C), Bay of Bengal (29.4°C), South China Sea (29.0°C), Chennai Coast (28.8°C), Caribbean Sea (28.6°C). Coldest in Arctic Ocean (-1.2°C) and Southern Ocean (1.8°C).
2. Salinity Concentration (PSU): Nominal global ocean baseline is 34.7 PSU.
   - High Salinity (Evaporation > Rainfall): Red Sea (40.5 PSU), Mediterranean Basin (38.6 PSU), Atlantic Ocean (36.8 PSU), Arabian Sea (36.6 PSU), Mumbai offshore (36.4 PSU).
   - Low Salinity (Freshwater Runoff / Ice Melt): Arctic Ocean (31.2 PSU), Bay of Bengal (32.8 PSU), Chennai Coast (33.5 PSU), California/SF Bay (33.8 PSU), South China Sea (33.9 PSU).
3. Hydrostatic Profiling Pressure: Measured in decibars (dbar). 1 dbar ≈ 1 meter depth. ARGO floats profile down to 2,000 dbar (2,000m depth) or Deep ARGO down to 6,000 dbar.
4. Ocean Current Velocities: Measured in knots. Fastest currents: Southern Ocean / ACC (4.8 knots), Atlantic / Gulf Stream (4.2 knots), Kuroshio / Tokyo Bay (3.9 knots), Pacific Ocean (3.8 knots).
5. ARGO Float Cycle: 10-day cycle (Drift 9 days at 1,000m parking depth -> dive to 2,000m -> ascend recording CTD temperature & salinity profiles -> transmit via Iridium satellites at surface).

ANSWERING GUIDELINES:
- Directly and accurately answer whatever the user asks.
- When asked about a specific location or float, quote exact values (SST, Salinity, Pressure, Depth, Current, Health) from the database.
- When comparing regions, contrast their exact metrics and explain the underlying physical oceanography (e.g., evaporation vs river discharge).
- Keep responses clean, well-formatted with bold key terms, bullet points, and concise explanations.`;

    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
      },
    });

    const reply = response.text || generateSmartFallbackChat(message, locationContext);
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    const reply = generateSmartFallbackChat(req.body.message, req.body.locationContext);
    return res.json({ reply });
  }
});

// 2. Dynamic Ocean Story Endpoint
app.post('/api/generate-story', async (req, res) => {
  try {
    const { location } = req.body;
    const ai = getGeminiClient();

    if (!ai || !location) {
      return res.json({
        story: `Welcome to ${location?.name || 'this ocean region'}. This region features dynamic thermal dynamics with an average surface temperature of ${location?.avgTemp || 28}°C and a salinity of ${location?.avgSalinity || 34.5} PSU. Autonomous ARGO floats are continuously monitoring salinity profiles, heat transport, and regional currents.`,
      });
    }

    const prompt = `Write an engaging, authoritative 4-sentence narrative story for ${location.name} (${location.nearestOcean}).
Include details: Surface Temp: ${location.avgTemp}°C, Salinity: ${location.avgSalinity} PSU, Current Speed: ${location.currentSpeed}, Active Floats: ${location.argoFloatIds?.length || 2}.
Highlight physical oceanography, thermal stratification, or climate significance in a sleek, awe-inspiring tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({ story: response.text || location.story });
  } catch (err) {
    return res.json({ story: req.body?.location?.story || 'Error generating story.' });
  }
});

// 2b. National Geographic Style Documentary Endpoint
app.post('/api/generate-documentary', async (req, res) => {
  try {
    const { location } = req.body;
    const ai = getGeminiClient();

    if (!ai || !location) {
      return res.json({ documentary: null });
    }

    const prompt = `Write a National Geographic style oceanographic documentary for ${location.name} in ${location.nearestOcean}.
Average Temperature: ${location.avgTemp}°C, Average Salinity: ${location.avgSalinity} PSU, Average Depth: ${location.avgDepth}m, Current Speed: ${location.currentSpeed}.

Return JSON strictly with the following schema:
{
  "overview": "Geography and location overview (2-3 sentences)",
  "formation": "Geological and tectonic formation history (2-3 sentences)",
  "climateImportance": "Role in global climate, monsoons, or thermohaline transport (2-3 sentences)",
  "biodiversity": "Marine life, ecosystems, and biological productivity (2-3 sentences)",
  "characteristics": "Ocean currents, surface circulation, and hydrography (2-3 sentences)",
  "economicImportance": "Maritime commerce, shipping, fisheries, and human impact (2-3 sentences)",
  "interestingFacts": ["5 intriguing oceanographic facts"],
  "aiSummary": "1-2 sentence AI telemetry summary based on satellite altimetry and ARGO float data"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ documentary: parsed });
  } catch (err) {
    console.error('Documentary generation error:', err);
    return res.json({ documentary: null });
  }
});

// 3. AI Ocean Report Endpoint
app.post('/api/generate-report', async (req, res) => {
  try {
    const { location } = req.body;
    const ai = getGeminiClient();

    if (!ai || !location) {
      return res.json({
        report: {
          id: `REP-${Date.now()}`,
          locationName: location?.name || 'Selected Ocean Sector',
          generatedAt: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
          summary: `Comprehensive oceanographic report for ${location?.name || 'Ocean Sector'}. Sea surface temperatures stand at ${location?.avgTemp || 28}°C with a salinity profile averaging ${location?.avgSalinity || 34.5} PSU. Thermal stratification and current vectors remain consistent with satellite altimetry.`,
          keyInsights: [
            `Thermocline barrier layer detected at ${location?.avgDepth ? Math.round(location.avgDepth / 5) : 120}m depth.`,
            `Surface salinity reflects ${location?.avgSalinity > 35 ? 'high regional evaporation' : 'river runoff dilution'}.`,
            `ARGO float fleet telemetry confirms steady horizontal advection.`,
          ],
          recommendations: [
            'Maintain continuous 10-day profiling intervals across active ARGO floats.',
            'Monitor upper-ocean heat content to issue early marine heatwave warnings.',
            'Cross-calibrate CTD sensor profiles with Sentinel-3 satellite altimetry.',
          ],
          metrics: {
            temperature: `${location?.avgTemp || 28}°C`,
            salinity: `${location?.avgSalinity || 34.5} PSU`,
            pressure: `${location?.avgPressure || 2000} dbar`,
            healthScore: location?.healthScore || 82,
            activeFloats: location?.argoFloatIds?.length || 3,
          },
        },
      });
    }

    const prompt = `Generate a detailed oceanographic assessment report for ${location.name}.
Data: Temp: ${location.avgTemp}°C, Salinity: ${location.avgSalinity} PSU, Current Speed: ${location.currentSpeed}, Depth: ${location.avgDepth}m, Health Score: ${location.healthScore}/100.
Return JSON with structure:
{
  "summary": "2-3 sentence executive summary",
  "keyInsights": ["3 bullet insights"],
  "recommendations": ["3 actionable recommendations"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let parsed = { summary: '', keyInsights: [], recommendations: [] };
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch (e) {
      parsed.summary = `Detailed analysis of ${location.name}.`;
      parsed.keyInsights = location.insights || [];
      parsed.recommendations = ['Monitor CTD profilers.', 'Track heat storage in thermocline.'];
    }

    return res.json({
      report: {
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        locationName: location.name,
        generatedAt: new Date().toLocaleDateString('en-US', { dateStyle: 'full' }),
        summary: parsed.summary || location.story,
        keyInsights: parsed.keyInsights.length ? parsed.keyInsights : location.insights,
        recommendations: parsed.recommendations.length ? parsed.recommendations : [
          'Maintain profiling intervals across local ARGO float array.',
          'Analyze temperature-salinity (T-S) diagrams for deep water mass tracking.',
          'Integrate satellite sea surface height anomalies with float density profiles.'
        ],
        metrics: {
          temperature: `${location.avgTemp}°C`,
          salinity: `${location.avgSalinity} PSU`,
          pressure: `${location.avgPressure} dbar`,
          healthScore: location.healthScore,
          activeFloats: location.argoFloatIds?.length || 2,
        },
      },
    });
  } catch (err) {
    console.error('Report error:', err);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
});

// Smart Fallback Chat Generator when API Key is missing or network fails
function generateSmartFallbackChat(userMsg: string, locContext: any): string {
  const query = (userMsg || '').trim().toLowerCase();

  // 1. Direct Location Name Matching across all 18 locations
  const matchedLoc = OCEAN_LOCATIONS.find((loc) => {
    const locNameLower = loc.name.toLowerCase();
    const idLower = loc.id.toLowerCase();
    const oceanLower = loc.nearestOcean.toLowerCase();
    return (
      query.includes(locNameLower) ||
      query.includes(idLower) ||
      (locNameLower.includes('bay of bengal') && query.includes('bengal')) ||
      (locNameLower.includes('arabian sea') && query.includes('arabian')) ||
      (locNameLower.includes('chennai') && query.includes('chennai')) ||
      (locNameLower.includes('mumbai') && query.includes('mumbai')) ||
      (locNameLower.includes('red sea') && query.includes('red sea')) ||
      (locNameLower.includes('mediterranean') && query.includes('med')) ||
      (locNameLower.includes('caribbean') && query.includes('caribbean')) ||
      (locNameLower.includes('coral reef') && query.includes('barrier reef')) ||
      (locNameLower.includes('gulf stream') && query.includes('gulf stream')) ||
      (locNameLower.includes('south china') && query.includes('china sea')) ||
      (locNameLower.includes('tokyo') && query.includes('tokyo')) ||
      (locNameLower.includes('sydney') && query.includes('sydney')) ||
      (locNameLower.includes('san francisco') && (query.includes('francisco') || query.includes('california')))
    );
  });

  if (matchedLoc) {
    const floatIdsStr = matchedLoc.argoFloatIds?.length
      ? matchedLoc.argoFloatIds.join(', ')
      : 'None active in immediate sector';

    return (
      `Here is the telemetry breakdown for **${matchedLoc.name}** (${matchedLoc.nearestOcean}):\n\n` +
      `• **Sea Surface Temperature**: **${matchedLoc.avgTemp}°C**\n` +
      `• **Salinity Concentration**: **${matchedLoc.avgSalinity} PSU** (Practical Salinity Units)\n` +
      `• **Average Depth & Pressure**: **${matchedLoc.avgDepth}m** (~**${matchedLoc.avgPressure} dbar**)\n` +
      `• **Surface Current Vector**: **${matchedLoc.currentSpeed}**\n` +
      `• **Ocean Health Index**: **${matchedLoc.healthScore} / 100**\n` +
      `• **Active ARGO Floats**: **${floatIdsStr}**\n\n` +
      `**Key Oceanographic Insights**:\n` +
      `${matchedLoc.insights.map((ins) => `• ${ins}`).join('\n')}`
    );
  }

  // 2. ARGO Float Specific Code Matching
  const matchedFloat = ARGO_FLOATS.find((f) => {
    const codeLower = f.code.toLowerCase();
    const idLower = f.id.toLowerCase();
    return query.includes(codeLower) || query.includes(idLower) || query.includes(f.name.toLowerCase());
  });

  if (matchedFloat) {
    return (
      `Telemetry Record for ARGO Float **#${matchedFloat.code}** ("${matchedFloat.name}"):\n\n` +
      `• **Ocean Basin**: **${matchedFloat.ocean}** (Nearest: ${matchedFloat.nearestCity || 'Open Ocean'})\n` +
      `• **Current Coordinates**: **${matchedFloat.lat.toFixed(2)}°N, ${matchedFloat.lng.toFixed(2)}°E**\n` +
      `• **CTD Sensor Readings**: Temp = **${matchedFloat.temp}°C**, Salinity = **${matchedFloat.salinity} PSU**\n` +
      `• **Profiling Depth**: **${matchedFloat.depth} meters**\n` +
      `• **Operational Status**: **${matchedFloat.status}** (Battery: ${matchedFloat.battery}%)\n` +
      `• **Last Surface Satellite Transmission**: **${matchedFloat.lastSurface}**\n` +
      `• **Deployment Date**: **${matchedFloat.deployDate}**`
    );
  }

  // 3. Superlatives & Rankings
  if (query.includes('highest salinity') || query.includes('most saline') || query.includes('saltiest')) {
    return (
      `The ocean basin with the **highest salinity** in our global telemetry network is the **Red Sea Rift** at **40.5 PSU**, followed by:\n\n` +
      `1. **Red Sea Rift**: **40.5 PSU** (Extreme desert evaporation)\n` +
      `2. **Mediterranean Basin**: **38.6 PSU** (High evaporation in enclosed basin)\n` +
      `3. **Atlantic Ocean**: **36.8 PSU** (Subtropical high evaporation zone)\n` +
      `4. **Arabian Sea**: **36.6 PSU** (ASHSW water mass formation)\n` +
      `5. **Mumbai offshore**: **36.4 PSU**`
    );
  }

  if (query.includes('lowest salinity') || query.includes('least saline') || query.includes('freshest')) {
    return (
      `The ocean region with the **lowest salinity** in our database is the **Arctic Ocean** at **31.2 PSU**, followed by:\n\n` +
      `1. **Arctic Ocean**: **31.2 PSU** (Polar sea ice melt & Siberian river discharge)\n` +
      `2. **Bay of Bengal**: **32.8 PSU** (1.5 trillion m³/yr runoff from Ganges & Brahmaputra)\n` +
      `3. **Chennai Coast**: **33.5 PSU** (Coastal freshwater plume mixing)\n` +
      `4. **San Francisco Bay**: **33.8 PSU** (Sacramento river delta discharge)\n` +
      `5. **South China Sea**: **33.9 PSU**`
    );
  }

  if (query.includes('warmest') || query.includes('hottest') || query.includes('highest temp')) {
    return (
      `The **warmest sea surface temperatures (SST)** in our database are recorded in:\n\n` +
      `1. **Red Sea Rift**: **30.2°C**\n` +
      `2. **Bay of Bengal**: **29.4°C** (Sustains South Asian Monsoon & Tropical Cyclones)\n` +
      `3. **South China Sea**: **29.0°C**\n` +
      `4. **Chennai Coast**: **28.8°C**\n` +
      `5. **Caribbean Sea**: **28.6°C**\n\n` +
      `*Coldest basins*: **Arctic Ocean** (**-1.2°C**) and **Southern Ocean** (**1.8°C**).`
    );
  }

  if (query.includes('coldest') || query.includes('lowest temp')) {
    return (
      `The **coldest ocean regions** in our telemetry network are:\n\n` +
      `1. **Arctic Ocean**: **-1.2°C** (Polar ice canopy)\n` +
      `2. **Southern Ocean**: **1.8°C** (Antarctic Circumpolar Current)\n` +
      `3. **San Francisco Bay / California Current**: **13.5°C** (Subpolar upwelling)\n` +
      `4. **Tokyo Bay / Kuroshio Extension**: **22.8°C**`
    );
  }

  if (query.includes('deepest') || query.includes('deepest ocean') || query.includes('max depth')) {
    return (
      `The **deepest ocean basins** in our active telemetry network are:\n\n` +
      `1. **Pacific Ocean**: Average depth **4,280 meters** (Pressure: **4,350 dbar**)\n` +
      `2. **Indian Ocean**: Average depth **3,741 meters** (Pressure: **3,810 dbar**)\n` +
      `3. **Atlantic Ocean**: Average depth **3,646 meters** (Pressure: **3,700 dbar**)\n` +
      `4. **Southern Ocean**: Average depth **3,270 meters** (Pressure: **3,320 dbar**)`
    );
  }

  if (query.includes('fastest current') || query.includes('strongest current') || query.includes('current speed')) {
    return (
      `The **fastest ocean currents** in our database are:\n\n` +
      `1. **Antarctic Circumpolar Current (ACC)** (Southern Ocean): **4.8 knots** (East)\n` +
      `2. **Gulf Stream** (Atlantic Ocean / Cape Hatteras): **4.2 knots** (North)\n` +
      `3. **Kuroshio Current** (Tokyo Bay, Japan): **3.9 knots** (NE)\n` +
      `4. **Equatorial Pacific Current**: **3.8 knots** (West)`
    );
  }

  // 4. Selected Location Context Specific Queries
  const locName = locContext?.name || 'the selected ocean';
  const nearestOcean = locContext?.nearestOcean || 'Global Basins';
  const temp = locContext?.avgTemp ?? 28.5;
  const salinity = locContext?.avgSalinity ?? 34.2;
  const depth = locContext?.avgDepth ?? 2000;
  const pressure = locContext?.avgPressure ?? 2020;
  const current = locContext?.currentSpeed ?? '2.4 knots';
  const health = locContext?.healthScore ?? 82;
  const floatCount = locContext?.argoFloatIds?.length ?? 3;
  const floatList = locContext?.argoFloatIds?.join(', ') || 'ARGO-IN-9842, ARGO-IN-9843';

  if (query.includes('salt') || query.includes('salin')) {
    return (
      `In **${locName}** (${nearestOcean}), the mean sea surface salinity is **${salinity} PSU** (Practical Salinity Units).\n\n` +
      `• **Salinity Drivers**: ${salinity > 35.5 ? 'Intense atmospheric evaporation exceeds precipitation, concentrating dissolved salts.' : 'Freshwater river runoff and precipitation dilute surface salt concentration.'}\n` +
      `• **Global Context**: Highest in Red Sea (40.5 PSU); Lowest in Arctic (31.2 PSU) and Bay of Bengal (32.8 PSU).`
    );
  }

  if (query.includes('temp') || query.includes('warm') || query.includes('heat')) {
    return (
      `In **${locName}**, sea surface temperature (SST) averages **${temp}°C**.\n\n` +
      `• **Thermal Mechanics**: High SST provides thermal energy that drives atmospheric convection and evaporation.\n` +
      `• **Global Context**: Red Sea (30.2°C) and Bay of Bengal (29.4°C) are among the warmest; Arctic Ocean (-1.2°C) is the coldest.`
    );
  }

  if (query.includes('argo') || query.includes('float') || query.includes('robot')) {
    return (
      `**${locName}** is actively monitored by **${floatCount} ARGO profiling floats** (${floatList}).\n\n` +
      `• **10-Day Profiling Cycle**: Floats drift at 1,000m depth for 9 days, descend to **${pressure} dbar** (2,000m), then ascend while CTD sensors record conductivity, temperature, and depth profiles.\n` +
      `• **Satellite Telemetry**: Data packets are beamed to satellite constellations upon surfacing.`
    );
  }

  if (query.includes('pressur') || query.includes('depth')) {
    return (
      `The average depth of **${locName}** is **${depth} meters**, corresponding to a hydrostatic profiling pressure of **${pressure} decibars (dbar)**.\n\n` +
      `• Hydrostatic pressure increases at approximately **1 dbar per meter** of seawater depth.`
    );
  }

  if (query.includes('current') || query.includes('speed') || query.includes('flow')) {
    return (
      `Surface ocean currents in **${locName}** flow at a mean speed of **${current}**.\n\n` +
      `• Driven by wind stress, trade winds, density gradients, and Coriolis force deflection.`
    );
  }

  if (query.includes('health') || query.includes('index')) {
    return (
      `**${locName}** maintains an Ocean Health Index of **${health} / 100**.\n\n` +
      `• Evaluates thermal stress anomalies, dissolved oxygen levels, ocean acidification, and ecosystem vitality.`
    );
  }

  // General Oceanography Concept Queries
  if (query.includes('psu') || query.includes('practical salinity')) {
    return (
      `**Practical Salinity Unit (PSU)** is the official oceanographic standard for measuring salt content in seawater based on electrical conductivity ratios.\n\n` +
      `• **Global Mean Ocean Salinity**: **34.7 PSU** (approx. 35 grams of dissolved salt per 1 kg of seawater).\n` +
      `• **High Evaporation**: Red Sea (**40.5 PSU**), Mediterranean (**38.6 PSU**), Atlantic (**36.8 PSU**).\n` +
      `• **Low Salinity**: Arctic (**31.2 PSU**), Bay of Bengal (**32.8 PSU**).`
    );
  }

  if (query.includes('dbar') || query.includes('decibar')) {
    return (
      `**Decibar (dbar)** is the standard unit of pressure in physical oceanography. Because seawater density is roughly 1025 kg/m³, **1 dbar of hydrostatic pressure corresponds almost exactly to 1 meter of depth**.\n\n` +
      `• Surface = 0 dbar\n` +
      `• ARGO Drift Depth = 1,000 dbar (~1,000m)\n` +
      `• Standard ARGO Maximum Profile = 2,000 dbar (~2,000m)\n` +
      `• Deep ARGO Maximum Profile = 6,000 dbar (~6,000m)`
    );
  }

  // Default Comprehensive Telemetry Overview
  return (
    `Verified satellite & ARGO float telemetry for **${locName}** (${nearestOcean}):\n\n` +
    `• **Sea Surface Temperature**: **${temp}°C**\n` +
    `• **Salinity Concentration**: **${salinity} PSU**\n` +
    `• **Hydrostatic Pressure**: **${pressure} dbar** (Depth: ${depth}m)\n` +
    `• **Surface Current Speed**: **${current}**\n` +
    `• **Ocean Health Index**: **${health} / 100**\n` +
    `• **Active ARGO Floats**: **${floatCount}** (${floatList})\n\n` +
    `Ask me any specific question about temperature profiles, salinity dynamics, ARGO floats, or ocean currents!`
  );
}

// Start Server with Vite Middleware in Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FloatChat Server running on http://localhost:${PORT}`);
  });
}

startServer();
