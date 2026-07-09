import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Ultra-high-fidelity offline fallback generator for premium performance and bulletproof reliability
function generateOfflineJourney(profile: any) {
  const dest = profile.destination && profile.destination.trim() !== "" ? profile.destination : "Kyoto, Japan";
  const budget = profile.budget || "Moderate";
  const duration = parseInt(profile.duration) || 5;
  const companion = profile.companion || "Solo";
  const adventure = profile.adventureLevel || "Balanced";
  const food = profile.foodPreference || "Local Street Food";
  const interests = profile.interests || ["Photography", "Hidden Gems"];

  const destLower = dest.toLowerCase();

  // Region configuration database
  let config = {
    currency: "JPY",
    exchangeRate: "1 USD = 155 JPY",
    rateLabel: "1 USD = 155 JPY",
    totalEst: "$1,850",
    flightCost: "$650",
    hotelCost: "$700",
    activitiesCost: "$200",
    transportCost: "$150",
    foodCost: "$150",
    recommendedMonths: "April - May & October - November",
    avgTemp: "18°C / 64°F",
    weatherCondition: "Sunny & Mild",
    weatherDetails: "Pleasant walking weather. Scattered cherry blossoms in spring, rich maple leaves in autumn.",
    passportStamp: "TYO-2026",
    police: "110",
    medical: "119",
    localEtiquetteTips: [
      "Remove your shoes when entering homes, ryokans, or traditional restaurants.",
      "Do not walk and eat at the same time; consume street food near the stall.",
      "Stand on the left side of escalators (in Kyoto) and keep quiet on trains."
    ],
    localEtiquette: [
      {
        rule: "The Quiet Commute",
        explanation: "Loud speaking, phone calls, or active audio playback without headphones on public transit is highly discouraged."
      },
      {
        rule: "Respectful Photography",
        explanation: "Always request permission before photographing geishas, monks, shopkeepers, or residential house entrances."
      }
    ],
    hiddenGems: [
      {
        name: "The Whisper Garden Café",
        description: "A moss-covered tea sanctuary run by a retired florist serving incredible loose-leaf brews.",
        whySpecial: "Completely hidden behind high bamboo walls, strictly zero social media presence to protect its serenity."
      },
      {
        name: "The Lantern Workshop Archway",
        description: "An old wooden archway that lights up with 200 hand-painted silk lanterns only after 10:00 PM.",
        whySpecial: "Tourists miss it because it is deeply nestled inside a residential alleyway behind the main temple."
      }
    ],
    photoSpots: [
      {
        spot: "The Red-Brick Waterway Corner",
        bestTime: "Early Morning (6:45 AM)",
        tip: "Stand adjacent to the old stone lantern to capture the reflection of soft sunlight hitting the wet brick path."
      },
      {
        spot: "High Bridge Overpass",
        bestTime: "Sunset (5:50 PM)",
        tip: "Use a wide-angle lens (24mm) to fit both the looming mountain silhouette and the modern city skyline lights."
      }
    ],
    dayTemplates: [
      {
        theme: "Arrival & Grounding",
        activities: [
          { time: "02:00 PM", title: "Settle into Ryokan Lodge", description: "Arrive at your premium traditional ryokan. Unwind with a cup of warm hand-whipped matcha.", cost: "Free", location: "Higashiyama District", photoSpot: false, hiddenGem: false },
          { time: "05:00 PM", title: "Fushimi Inari Torii Stroll", description: "Wander past the initial rows of glowing orange Torii gates as twilight settles.", cost: "Free", location: "Fushimi Inari Shrine", photoSpot: true, hiddenGem: false },
          { time: "07:30 PM", title: "Artisanal Ramen Ritual", description: "Savor handmade rich broth ramen at a wooden counter seating only six guests.", cost: "$25", location: "Sakura Lane Bistro", photoSpot: false, hiddenGem: true }
        ]
      },
      {
        theme: "Zen Gardens & Historic Alleys",
        activities: [
          { time: "09:30 AM", title: "Kinkaku-ji Golden Refraction", description: "Witness the magnificent Golden Pavilion's perfect mirror reflection in the surrounding glass pond.", cost: "$10", location: "Kita Ward", photoSpot: true, hiddenGem: false },
          { time: "01:00 PM", title: "Bamboo Path Wandering", description: "Breathe in the calm, rustling bamboo stalks of Arashiyama during the quiet midday hour.", cost: "Free", location: "Arashiyama Forest", photoSpot: true, hiddenGem: false },
          { time: "06:30 PM", title: "Gion Lantern Lit Patrol", description: "Walk the historic flagstone streets of Gion. Spot geishas gliding into tea houses.", cost: "Free", location: "Gion District", photoSpot: false, hiddenGem: true }
        ]
      },
      {
        theme: "Modern Neon & Shibuya Drift",
        activities: [
          { time: "11:00 AM", title: "Bullet Train to Tokyo Terminal", description: "Board the high-speed Shinkansen. Watch Mt. Fuji rush past the window.", cost: "$90", location: "Kyoto Main Station", photoSpot: false, hiddenGem: false },
          { time: "04:00 PM", title: "Shibuya Crossing Overhead View", description: "Watch the synchronized human flow from a hidden second-story library window.", cost: "$15", location: "Shibuya Sky Overlook", photoSpot: true, hiddenGem: false },
          { time: "08:30 PM", title: "Memory Lane Lanterns", description: "Dine on grilled yakitori skewers beneath dense retro neon signs in Omoide Yokocho.", cost: "$35", location: "Shinjuku Alleyways", photoSpot: false, hiddenGem: true }
        ]
      },
      {
        theme: "Tea Artistry & Subterranean Tokyo",
        activities: [
          { time: "10:00 AM", title: "Imperial Palace Gardens Walk", description: "Walk past historical castle moats and pine trees in the quiet heart of Tokyo.", cost: "Free", location: "Chiyoda Gardens", photoSpot: true, hiddenGem: false },
          { time: "02:00 PM", title: "Subterranean Cyber Shrine Exploration", description: "Dive into a hidden digital art museum displaying reactive projections and lights.", cost: "$30", location: "Digital Art Vault", photoSpot: true, hiddenGem: true },
          { time: "07:00 PM", title: "Michelin Gastronomic Tasting", description: "Enjoy seasonal tempura cooked piece-by-piece in front of you by a master chef.", cost: "$120", location: "Ginza Alleyway Shop", photoSpot: false, hiddenGem: false }
        ]
      },
      {
        theme: "Sunrise Reflections & Departure",
        activities: [
          { time: "09:00 AM", title: "Ueno Park Lotus Walk", description: "Watch the morning mist rise off Shinobazu Pond's giant lotus leaves.", cost: "Free", location: "Ueno District", photoSpot: true, hiddenGem: false },
          { time: "12:00 PM", title: "Artisanal Stationary Crafting", description: "Purchase traditional hand-pressed washi paper and customized stamps from a legacy merchant.", cost: "$25", location: "Nihonbashi", photoSpot: false, hiddenGem: true },
          { time: "03:00 PM", title: "Departure Express Boarding", description: "Board the Narita Express train with your digital passport and memories.", cost: "Free", location: "Tokyo Main Terminal", photoSpot: false, hiddenGem: false }
        ]
      }
    ],
    postcardBody: `I am writing this from a tiny candle-lit café in Kyoto. Today, I walked through misty bamboo paths, drank fresh hand-whipped matcha, and watched the soft golden hour paint the wooden temple shingles. The noise of scheduling has completely melted away, replaced by pure wonder. You belong here.`
  };

  // 1. India Golden Triangle
  if (destLower.includes("india") || destLower.includes("delhi") || destLower.includes("jaipur") || destLower.includes("agra")) {
    config = {
      currency: "INR",
      exchangeRate: "1 USD = 83.5 INR",
      rateLabel: "1 USD = 83.5 INR",
      totalEst: "$1,450",
      flightCost: "$700",
      hotelCost: "$400",
      activitiesCost: "$150",
      transportCost: "$100",
      foodCost: "$100",
      recommendedMonths: "October - March",
      avgTemp: "26°C / 79°F",
      weatherCondition: "Warm & Sunny",
      weatherDetails: "Pleasant, dry winter weather. Cool morning breezes and glorious sunny afternoons.",
      passportStamp: "DEL-2026",
      police: "112",
      medical: "102",
      localEtiquetteTips: [
        "Use your right hand exclusively for eating or receiving sacred items.",
        "Dress modestly (cover shoulders and knees) when visiting temples and mausoleums.",
        "Always remove your shoes and cover your head when entering a Gurudwara (Sikh temple)."
      ],
      localEtiquette: [
        { rule: "Respectful Dress Code", explanation: "Many Indian historic sites require removing shoes. Keep slip-on socks handy." },
        { rule: "Symmetry Appreciation", explanation: "Do not rush. Take time to marvel at the geometric perfection of Mughal architecture." }
      ],
      hiddenGems: [
        { name: "Agrasen Ki Baoli stepwell", description: "An ancient 60-meter-long red stone stepwell hidden right amidst New Delhi's skyscrapers.", whySpecial: "Has 103 stone steps and a dramatic quiet atmosphere far removed from the city traffic." },
        { name: "The Monkey Temple of Galta Ji", description: "A historic pink stone temple complex built around natural water springs just outside Jaipur.", whySpecial: "Surrounded by mountain cliffs and home to playful macaque colonies." }
      ],
      photoSpots: [
        { spot: "Mehtab Bagh at Dawn", bestTime: "Sunrise (5:45 AM)", tip: "Stand across the Yamuna River to capture the Taj Mahal's marble reflection in perfect, quiet morning light." },
        { spot: "The Tattoo Café overlook", bestTime: "Late Afternoon (4:30 PM)", tip: "Get an elevated wide angle of the magnificent pink facade of Hawa Mahal directly from the opposite rooftop." }
      ],
      dayTemplates: [
        {
          theme: "Delhi Sensory Awakening",
          activities: [
            { time: "09:30 AM", title: "Chandni Chowk Rickshaw Odyssey", description: "Breathe in the intense cardamoms and spices in Old Delhi's historic spice markets.", cost: "$15", location: "Khari Baoli market", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Red Fort Majestic Walk", description: "Walk through the colossal red sandstone ramparts of the grand Mughal palace.", cost: "$10", location: "Netaji Subhash Marg", photoSpot: true, hiddenGem: false },
            { time: "07:30 PM", title: "Subterranean Mughlai Feast", description: "Taste authentic slow-cooked butter chicken and garlic naans at an old legacy kitchen.", cost: "$20", location: "Jama Masjid lanes", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Marble Symmetry of Agra",
          activities: [
            { time: "06:00 AM", title: "Express Train to Agra", description: "Board the Gatimaan Express. Watch the green fields of Uttar Pradesh fly by.", cost: "$30", location: "New Delhi Station", photoSpot: false, hiddenGem: false },
            { time: "11:00 AM", title: "Taj Mahal Close Inspection", description: "Stand directly before the grand white dome. Witness the complex semi-precious stone inlays.", cost: "$15", location: "Taj East Gate", photoSpot: true, hiddenGem: false },
            { time: "04:30 PM", title: "Agra Fort Cliff Exploration", description: "Explore the giant red stone fortress where Emperor Shah Jahan was imprisoned overlooking his creation.", cost: "$8", location: "Agra Fort", photoSpot: true, hiddenGem: false }
          ]
        },
        {
          theme: "Jaipur Pink City Palace",
          activities: [
            { time: "10:00 AM", title: "Amber Fort Hill Climb", description: "Explore the honey-colored castle fortress nested on the hills of Jaipur.", cost: "$12", location: "Amer Road", photoSpot: true, hiddenGem: false },
            { time: "03:00 PM", title: "City Palace & Astronomical Sundials", description: "See giant marble sundials and the royal blue structures of the royal palace.", cost: "$15", location: "Chogan Stadium", photoSpot: true, hiddenGem: false },
            { time: "07:00 PM", title: "Traditional Handloom Weaving Tour", description: "Witness artisans hand-stamping block print cotton sheets and indigo dyes.", cost: "Free", location: "Johri Bazaar", photoSpot: false, hiddenGem: true }
          ]
        }
      ],
      postcardBody: `I am writing to you from a colorful terrace overlooking the pink facades of Jaipur. Today, I experienced Old Delhi's intense cardamom-scented bazaars, stood before the quiet marble symmetry of the Taj Mahal at dawn, and climbed ancient hilltop forts. The planning was entirely handled; I am just absorbing the raw magic of India.`
    };
  }

  // 2. USA West (Grand Canyon & PCH)
  else if (destLower.includes("usa") || destLower.includes("canyon") || destLower.includes("highway") || destLower.includes("california") || destLower.includes("arizona")) {
    config = {
      currency: "USD",
      exchangeRate: "1 USD = 1 USD",
      rateLabel: "1 USD = 1 USD",
      totalEst: "$2,650",
      flightCost: "$850",
      hotelCost: "$1,100",
      activitiesCost: "$350",
      transportCost: "$200",
      foodCost: "$150",
      recommendedMonths: "September - November & April - June",
      avgTemp: "21°C / 70°F",
      weatherCondition: "Sunny & Dry",
      weatherDetails: "Crisp mountain breezes and desert sunshine. Bring polarized sunglasses and high SPF skin protection.",
      passportStamp: "USA-2026",
      police: "911",
      medical: "911",
      localEtiquetteTips: [
        "A standard 18-20% tipping rate is expected in sit-down restaurants.",
        "Strictly respect national park boundaries and stay on marked desert trails.",
        "Do not leave any food or trash in rental cars to prevent bear or wild animal break-ins."
      ],
      localEtiquette: [
        { rule: "Wildlife Distancing", explanation: "Keep a safe distance of at least 25 yards from elk, coyotes, and forest animals." },
        { rule: "Leave No Trace", explanation: "Pack out everything you pack in. The high desert ecosystem is incredibly fragile." }
      ],
      hiddenGems: [
        { name: "Shoshone Point Rim Trail", description: "An unpaved, unmarked dirt path leading to a dramatic secluded peninsula overlooking the canyon's eastern abyss.", whySpecial: "Avoids 99% of the park shuttle crowds; quiet wind sounds and spectacular vistas." },
        { name: "Partington Cove Tunnel", description: "A historical wooden tunnel leading to a secret rocky cove where bootleggers smuggled goods during prohibition.", whySpecial: "Nestled behind giant coastal redwoods with breathtaking ocean water colors." }
      ],
      photoSpots: [
        { spot: "Bixby Bridge Coastal Cliff", bestTime: "Sunset (7:30 PM)", tip: "Park on the northwest gravel lot and look south to frame the concrete arch arching elegantly over the crashing Pacific waves." },
        { spot: "Lipan Point Canyon Rim", bestTime: "Sunrise (5:15 AM)", tip: "Use a medium telephoto lens (50mm) to capture the Colorado River winding through the deep orange canyon floor." }
      ],
      dayTemplates: [
        {
          theme: "Pacific Cliffs & Redwood Scent",
          activities: [
            { time: "09:00 AM", title: "Muir Woods Redwood Trek", description: "Walk among 1000-year-old giant redwood trees. Breathe in the cool pine dampness.", cost: "$15", location: "Mill Valley Coast", photoSpot: true, hiddenGem: false },
            { time: "01:30 PM", title: "Highway 1 Convertible Drift", description: "Drive along the cliff edges of Big Sur. Stop to watch grey whales spout in the distance.", cost: "$80", location: "PCH Highway 1", photoSpot: true, hiddenGem: false },
            { time: "06:30 PM", title: "Seafood Dock Tasting", description: "Feast on steaming clam chowder served directly in sourdough bread bowls.", cost: "$30", location: "Monterey Wharf", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Desert Red Rocks of Sedona",
          activities: [
            { time: "10:00 AM", title: "Bell Rock Vortex Walk", description: "Hike around massive red clay cliffs. Absorb the warm solar radiation feel of the high desert.", cost: "$5", location: "Sedona Highway 179", photoSpot: true, hiddenGem: false },
            { time: "03:00 PM", title: "Artisanal Adobe Village", description: "Browse hand-blown glassware and turquoise jewellery in a traditional Mexican adobe market.", cost: "Free", location: "Tlaquepaque Village", photoSpot: false, hiddenGem: true },
            { time: "07:30 PM", title: "Stargazing Desert Fire", description: "Witness the cosmic Milky Way belt in one of the world's premier dark sky communities.", cost: "Free", location: "Sedona Rim Overlook", photoSpot: true, hiddenGem: false }
          ]
        },
        {
          theme: "Grand Canyon Sublimity",
          activities: [
            { time: "06:00 AM", title: "Mather Point Sun Explosion", description: "Watch the shadows retreat, exposing 2 billion years of colorful geological layers in seconds.", cost: "$35", location: "Grand Canyon South Rim", photoSpot: true, hiddenGem: false },
            { time: "10:30 AM", title: "Bright Angel Inner Trail Descent", description: "Hike down the historical switchback trail. Marvel at the sheer scale of the rock faces.", cost: "Free", location: "South Kaibab Trailhead", photoSpot: true, hiddenGem: false },
            { time: "03:00 PM", title: "Historic Route 66 Diner Stop", description: "Sit in a retro 1950s leather booth. Drink a thick handcrafted vanilla milkshake.", cost: "$15", location: "Seligman Loop 66", photoSpot: false, hiddenGem: true }
          ]
        }
      ],
      postcardBody: `Greetings from the open road of the American West. Today, I drove along the high sea cliffs of the Pacific Coast Highway, walked under towering redwoods, and stood on the rim of the Grand Canyon at sunrise as the earth lit up in crimson. The sheer scale is breathtaking. I'm traveling offline, fully immersed.`
    };
  }

  // 3. Peru (Machu Picchu & Sacred Valley)
  else if (destLower.includes("peru") || destLower.includes("picchu") || destLower.includes("cusco") || destLower.includes("andean")) {
    config = {
      currency: "PEN",
      exchangeRate: "1 USD = 3.75 PEN",
      rateLabel: "1 USD = 3.75 PEN",
      totalEst: "$2,100",
      flightCost: "$750",
      hotelCost: "$750",
      activitiesCost: "$350",
      transportCost: "$150",
      foodCost: "$100",
      recommendedMonths: "May - September",
      avgTemp: "14°C / 57°F",
      weatherCondition: "Cool & Crisp",
      weatherDetails: "Sunny winter days with freezing Andean nights. Carry heavy thermal layers and drink hot coca tea.",
      passportStamp: "PER-2026",
      police: "105",
      medical: "117",
      localEtiquetteTips: [
        "Always ask for permission before taking photographs of local indigenous children or alpacas.",
        "Take your first day very slowly; rest and drink Coca leaf tea to prevent severe altitude sickness.",
        "Do not step on or touch the ancient Incan stone walls; many are structurally sensitive."
      ],
      localEtiquette: [
        { rule: "Respecting the Quechua", explanation: "Quechua is the ancient living language here. A polite 'Allillanchu' (hello) is highly appreciated." },
        { rule: "Slow Adaptation", explanation: "Cusco is at 3,400m elevation. Respect your lungs; walk slowly on cobblestone slopes." }
      ],
      hiddenGems: [
        { name: "The terraces of Moray backtrail", description: "An ancient amphitheater-like terraced hollow where Incans tested microclimates on crops.", whySpecial: "Avoid the main bus tour entrance; walk the perimeter to hear acoustic projections." },
        { name: "Písac Observatory Cliff", description: "Intricate stone ceremonial structures clinging to the steep cliffs high above the standard artisan market.", whySpecial: "Has incredible solar alignments and zero crowds because of the arduous uphill stairs." }
      ],
      photoSpots: [
        { spot: "The Guardhouse Overlook", bestTime: "Mid-Afternoon (3:00 PM)", tip: "Wait until the morning clouds completely disperse, exposing the sharp jagged peak of Huayna Picchu towering behind the stone ruins." },
        { spot: "San Blas Blue Fountain", bestTime: "Twilight (6:00 PM)", tip: "Settle near the old blue Spanish arches to capture the glowing orange cobblestones of Cusco's artisan district." }
      ],
      dayTemplates: [
        {
          theme: "Cobblestone Cusco Settle",
          activities: [
            { time: "11:00 AM", title: "San Pedro Herb Market walk", description: "Smell fresh mint, eucalyptus, and regional mountain potatoes in a massive open-air hall.", cost: "Free", location: "Tupac Amaru street", photoSpot: true, hiddenGem: false },
            { time: "03:00 PM", title: "Sacsayhuamán Giant Stones Walk", description: "Marvel at the astronomical walls built of giant interlocking 120-ton stone blocks.", cost: "$20", location: "Don Bosco hill", photoSpot: true, hiddenGem: false },
            { time: "07:00 PM", title: "Andean Soul Food Diner", description: "Taste slow-cooked alpaca tenderloins and native potato stews inside an intimate clay dining room.", cost: "$35", location: "Plaza de Armas", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Pink Terraces of the Sacred Valley",
          activities: [
            { time: "08:30 AM", title: "Maras Salt Pan Exploration", description: "Walk among 3,000 terraced pink salt pools heated by a warm subterranean mineral stream.", cost: "$15", location: "Maras Highway", photoSpot: true, hiddenGem: false },
            { time: "01:30 PM", title: "Traditional Textile Looming", description: "Learn how Quechua women use natural cochineal beetles to dye raw alpaca wool brilliant scarlet.", cost: "Free", location: "Chinchero Weaver Guild", photoSpot: false, hiddenGem: true },
            { time: "06:00 PM", title: "Ollantaytambo Stone Valley Hike", description: "Climb the massive fortress terraces overlooking the rushing Urubamba River valley.", cost: "$12", location: "Sacred Valley Highway", photoSpot: true, hiddenGem: false }
          ]
        },
        {
          theme: "Machu Picchu Cloud Kingdom",
          activities: [
            { time: "06:30 AM", title: "Vistadome Glass train journey", description: "Ride alongside the roaring river. Watch the dry highlands morph into dense jungle orchids.", cost: "$85", location: "Ollantaytambo Station", photoSpot: true, hiddenGem: false },
            { time: "10:00 AM", title: "Lost Citadel Exploration", description: "Wander past precision-carved sundials and agricultural terraces built into sheer vertical cliffs.", cost: "$40", location: "Machu Picchu Citadel", photoSpot: true, hiddenGem: false },
            { time: "04:00 PM", title: "Warm Cocoa & Craft Workshop", description: "Roast artisanal Peruvian chocolate beans over an open clay hearth.", cost: "$20", location: "Aguas Calientes village", photoSpot: false, hiddenGem: true }
          ]
        }
      ],
      postcardBody: `I am writing this from a tiny stone balcony high in the Andes. Today, I walked past massive interlocking Incan stone walls, stood beside the pink terraced pools of Maras, and saw the legendary Machu Picchu citadel emerge from the morning clouds. The mountain air is incredibly crisp and pure. Every detail of this journey is pristine.`
    };
  }

  // 4. UK (Scottish Highlands & Edinburgh)
  else if (destLower.includes("uk") || destLower.includes("scottish") || destLower.includes("scotland") || destLower.includes("edinburgh") || destLower.includes("highlands")) {
    config = {
      currency: "GBP",
      exchangeRate: "1 USD = 0.78 GBP",
      rateLabel: "1 USD = 0.78 GBP",
      totalEst: "$2,150",
      flightCost: "$650",
      hotelCost: "$900",
      activitiesCost: "$250",
      transportCost: "$200",
      foodCost: "$150",
      recommendedMonths: "May - September",
      avgTemp: "12°C / 54°F",
      weatherCondition: "Misty & Atmospheric",
      weatherDetails: "Rapidly changing maritime weather. Carry waterproof outerwear and sturdy walking boots for muddy trails.",
      passportStamp: "EDI-2026",
      police: "999",
      medical: "999",
      localEtiquetteTips: [
        "Do not refer to Scottish residents as 'English' or imply Scotland is identical to England.",
        "Always keep left when walking on narrow gravel paths or driving on single-track Highland roads.",
        "When visiting a whisky distillery, add only a few drops of pure water to your glass rather than heavy ice."
      ],
      localEtiquette: [
        { rule: "Single-Track Road Courtesies", explanation: "Always pull into the passing place on your left to let faster vehicles pass." },
        { rule: "Respecting the Moorland", explanation: "Avoid stepping on nesting heather. Keep to paths to protect the fragile peatlands." }
      ],
      hiddenGems: [
        { name: "Dean Village riverside valley", description: "A quiet, green 19th-century water milling hamlet tucked beneath a stone bridge, 10 minutes from Edinburgh's city centre.", whySpecial: "Stone cottage turrets, blooming ivy, and absolute silence alongside the rushing Water of Leith." },
        { name: "The hidden church of Dunstaffnage", description: "A ruined 13th-century stone chapel surrounded by massive oak trees and ancient Highland burial plaques.", whySpecial: "Has incredible echoes inside the moss-covered gothic window arches." }
      ],
      photoSpots: [
        { spot: "Calton Hill Overlook", bestTime: "Sunset (8:45 PM)", tip: "Align the Athenian columns of the National Monument with the dramatic gothic silhouette of the Scott Monument and Edinburgh Castle." },
        { spot: "Glenfinnan Viaduct Overlook", bestTime: "Morning (10:15 AM)", tip: "Walk the high heather path behind the monument to capture the red steam train passing over the majestic 21-arch concrete curved viaduct." }
      ],
      dayTemplates: [
        {
          theme: "Volcanic Castle & Cobblestones",
          activities: [
            { time: "09:30 AM", title: "Royal Mile Historic Vaults walk", description: "Wander past ancient stone tenements. Sift through narrow cobblestone wynds and passages.", cost: "Free", location: "Royal Mile", photoSpot: true, hiddenGem: false },
            { time: "01:30 PM", title: "Edinburgh Castle Volcanic Ridge climb", description: "Stand upon the volcanic crag. View the ancient Scottish regalia crowns and historic cannons.", cost: "$25", location: "Castle Esplanade", photoSpot: true, hiddenGem: false },
            { time: "07:30 PM", title: "Whisky Single-Malt Vault Tasting", description: "Taste rare peated whiskies inside a dark, candle-lit subterranean stone cellar.", cost: "$45", location: "Old Town Cellars", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Haunting Glens of Glen Coe",
          activities: [
            { time: "09:00 AM", title: "Drive into the Scottish Highlands", description: "Watch the low lowlands morph into massive, heather-covered mountains shrouded in mist.", cost: "$40", location: "Loch Lomond highway", photoSpot: true, hiddenGem: false },
            { time: "01:00 PM", title: "Glen Coe Valley Walking Trails", description: "Walk the dramatic green glen surrounded by sheer grey peaks and tumbling waterfalls.", cost: "Free", location: "Glen Coe Gorge", photoSpot: true, hiddenGem: false },
            { time: "06:30 PM", title: "Traditional Highland Inn Pub meal", description: "Savor steaming hot venison pies and craft ales beside a crackling wooden fireplace.", cost: "$30", location: "Clachaig Inn", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Lochs & Mythical Fairy Pools",
          activities: [
            { time: "10:00 AM", title: "Loch Ness Shoreline Exploration", description: "Walk along the deep, dark shores of Loch Ness. Explore Urquhart Castle's stone ruins.", cost: "$15", location: "Drumnadrochit", photoSpot: true, hiddenGem: false },
            { time: "02:30 PM", title: "Fairy Pools Emerald Water walk", description: "Hike along crystal clear turquoise pools cascading down from the rocky Cuillin mountains.", cost: "Free", location: "Isle of Skye", photoSpot: true, hiddenGem: true },
            { time: "07:00 PM", title: "Seafood Harbor feast", description: "Savor freshly caught langoustines and crab claws served raw with lemon inside a harbor shack.", cost: "$40", location: "Portree Harbour", photoSpot: false, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `I am writing this from a cozy wooden tavern in the Scottish Highlands. Today, I walked Edinburgh's cobblestone wynds, drove through the deep valleys of Glen Coe beneath massive misty peaks, and drank single-malt scotch whisky beside a warm fireplace. The atmosphere is purely legendary and timeless.`
    };
  }

  // 5. Italy (Amalfi Coast & Rome)
  else if (destLower.includes("italy") || destLower.includes("amalfi") || destLower.includes("rome") || destLower.includes("positano") || destLower.includes("italian")) {
    config = {
      currency: "EUR",
      exchangeRate: "1 USD = 0.92 EUR",
      rateLabel: "1 USD = 0.92 EUR",
      totalEst: "$2,400",
      flightCost: "$700",
      hotelCost: "$1,000",
      activitiesCost: "$300",
      transportCost: "$150",
      foodCost: "$250",
      recommendedMonths: "May - October",
      avgTemp: "24°C / 75°F",
      weatherCondition: "Sunny & Warm",
      weatherDetails: "Glorious Mediterranean sunshine. Carry a light linen shirt, sun hat, and comfortable leather walking sandals.",
      passportStamp: "ROM-2026",
      police: "112",
      medical: "118",
      localEtiquetteTips: [
        "Never order a cappuccino after 11:00 AM; locals consume espresso exclusively in the afternoon.",
        "You must validate your regional train ticket in the green machines before stepping on board.",
        "Always dress respectfully (cover shoulders and knees) when entering basilica churches."
      ],
      localEtiquette: [
        { rule: "Espresso Bar Protocols", explanation: "Pay at the register first, then bring your receipt to the counter to receive your coffee." },
        { rule: "Table Etiquette", explanation: "Meals are meant to be enjoyed slowly. Do not wave aggressively to request the bill." }
      ],
      hiddenGems: [
        { name: "Fiordo di Furore cove", description: "A hidden, tiny shingle beach nested inside a steep limestone fjord, spanned by a majestic arched bridge.", whySpecial: "Completely sheltered from waves; beautiful cool waters and old fishermen's stone huts." },
        { name: "Villa Celimontana gardens", description: "A tranquil municipal park filled with ancient marble busts and stone sarcophagi, 10 minutes from the Colosseum.", whySpecial: "Extremely quiet; loved by local writers and void of busy tourist lines." }
      ],
      photoSpots: [
        { spot: "Positano Scenic S-Bend Overlook", bestTime: "Sunset (8:10 PM)", tip: "Stand on the coastal road wall just south of town to capture the entire vertical cliffside painted in pastel colors lighting up as twilight arrives." },
        { spot: "Trevi Fountain Empty Frame", bestTime: "Sunrise (6:00 AM)", tip: "Arrive before the city wakes up to capture the grand white marble sculptures reflecting in the deep turquoise pool without crowds." }
      ],
      dayTemplates: [
        {
          theme: "Ancient Rome & Espresso Squares",
          activities: [
            { time: "09:30 AM", title: "Colosseum Inner Stone Arena walk", description: "Step onto the historical wooden stage. Walk past the underground gladiatorial chambers.", cost: "$20", location: "Piazza del Colosseo", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Pantheon Dome & Piazza walk", description: "Look up at the perfect open oculus of the 2000-year-old concrete dome. Savor authentic hazelnut gelato.", cost: "$10", location: "Piazza della Rotonda", photoSpot: true, hiddenGem: false },
            { time: "08:00 PM", title: "Trastevere Cobblestone Dinner", description: "Eat handmade cacio e pepe pasta served in warm pecorino cheese bowls inside a narrow ivy-covered alleyway.", cost: "$35", location: "Vicolo del Cinque", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Cliffside Positano Amalfi Coast",
          activities: [
            { time: "09:00 AM", title: "High-Speed Southbound Train", description: "Ride the Frecciarossa train south past Mount Vesuvius to Salerno Harbour.", cost: "$45", location: "Roma Termini", photoSpot: false, hiddenGem: false },
            { time: "02:00 PM", title: "Positano Coastal Walking Tour", description: "Navigate down hundreds of steep pastel-colored stairs. Smell the heavy lemon trees.", cost: "Free", location: "Positano Beachfront", photoSpot: true, hiddenGem: false },
            { time: "07:30 PM", title: "Cliffside Lemon Sauce Fish Dinner", description: "Feast on freshly grilled sea bass and drink ice-cold limoncello liqueur overlooking the water.", cost: "$50", location: "Amalfi Coast Highway", photoSpot: true, hiddenGem: true }
          ]
        },
        {
          theme: "Capri Sea Caves & Sunset",
          activities: [
            { time: "10:00 AM", title: "Limestone Catamaran Cruise", description: "Sail around the dramatic Faraglioni rock arches. Swim in the neon-blue Grotta Azzurra.", cost: "$70", location: "Sorrento Harbour", photoSpot: true, hiddenGem: false },
            { time: "03:00 PM", title: "Path of the Gods Cliff hike", description: "Hike the highest mountain ridge. Peer down at Positano's tiny houses nestled along the coast.", cost: "Free", location: "Agerola Ridge", photoSpot: true, hiddenGem: true },
            { time: "07:30 PM", title: "Artisanal Pizza & Olive oil tasting", description: "Savor wood-fired truffle pizza inside an old olive mill run by legacy farmers.", cost: "$30", location: "Sorrento Hills", photoSpot: false, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `Ciao from the sunny Amalfi Coast. Today, I walked past the giant stone columns of Rome, ate handmade pasta in a quiet Trastevere alley, and watched the pastel houses of Positano glow in the sunset over the deep blue Mediterranean Sea. Life moves beautifully here. Every detail has been pure delight.`
    };
  }

  // 6. Africa (Kenya Safari)
  else if (destLower.includes("kenya") || destLower.includes("safari") || destLower.includes("mara") || destLower.includes("mombasa") || destLower.includes("africa")) {
    config = {
      currency: "KES",
      exchangeRate: "1 USD = 130 KES",
      rateLabel: "1 USD = 130 KES",
      totalEst: "$2,850",
      flightCost: "$950",
      hotelCost: "$1,100",
      activitiesCost: "$450",
      transportCost: "$200",
      foodCost: "$150",
      recommendedMonths: "July - October & January - March",
      avgTemp: "25°C / 77°F",
      weatherCondition: "Warm Savanna Breeze",
      weatherDetails: "Dry grassland winds with high solar intensity. Pack lightweight canvas clothing and highly polar protective lenses.",
      passportStamp: "NBO-2026",
      police: "999",
      medical: "999",
      localEtiquetteTips: [
        "Avoid making loud noises, whistling, or shouting when near safari animals; it triggers stress.",
        "Always greet locals with a warm 'Jambo' (hello) and ask before taking photos in villages.",
        "Tipping your private safari guide and camp staff is highly customary and deeply appreciated."
      ],
      localEtiquette: [
        { rule: "Respect the Wild", explanation: "Never feed monkeys or savanna wildlife. It disrupts their natural hunting habits." },
        { rule: "Eco-Friendly Packing", explanation: "Single-use plastic bags are strictly illegal in Kenya. Do not pack them in your luggage." }
      ],
      hiddenGems: [
        { name: "Mara River Hippo Bend", description: "A secluded, elevated river bend hidden behind thick acacia groves where 80+ hippos congregate to escape the sun.", whySpecial: "Avoids the standard safari trail routes; hear the deep grunting echoes up close." },
        { name: "Fort Jesus Subterranean Passages", description: "A series of cool, hand-carved coral stone defensive chambers built inside the 16th-century Portuguese fortress.", whySpecial: "Contains centuries of ancient Swahili and Portuguese charcoal shipping graffiti." }
      ],
      photoSpots: [
        { spot: "Lone Acacia Silhouette", bestTime: "Sunset (6:15 PM)", tip: "Wait until the sun descends directly behind a single umbrella acacia tree to capture a stark black silhouette against a blazing crimson savanna sky." },
        { spot: "Old Town Carved Doors", bestTime: "Morning (9:30 AM)", tip: "Use soft side lighting to photograph the intricate, centuries-old brass-studded wooden Swahili doors in Mombasa's alleyways." }
      ],
      dayTemplates: [
        {
          theme: "Savanna Crossing Patrol",
          activities: [
            { time: "06:30 AM", title: "Sunrise Wildlife Patrol", description: "Board an open 4x4 cruiser. Scan the golden plains for lions, cheetahs, and majestic elephants.", cost: "$60", location: "Maasai Mara grasslands", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Savanna Camp Settle & Rest", description: "Unwind in a luxurious safari tented cabin. Watch giraffes walk past the river bend from your deck.", cost: "Free", location: "Mara River luxury camp", photoSpot: true, hiddenGem: false },
            { time: "07:30 PM", title: "Campfire Bush Dinner", description: "Feast on roasted meats and fresh vegetables beside a crackling log fire under the stars.", cost: "$40", location: "Mara Bush Clearing", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Maasai Warrior Rituals",
          activities: [
            { time: "09:00 AM", title: "Authentic Manyatta Village Visit", description: "Learn about Maasai cattle tracking, ancient spear-making, and high-jumping songs.", cost: "$35", location: "Maasai Plains Manyatta", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Cheetah Hunt tracking drive", description: "Explore deep bush trails to spot elusive cheetahs perched on old termite mounds.", cost: "$40", location: "Oloololo Escarpment", photoSpot: true, hiddenGem: true },
            { time: "06:30 PM", title: "Amber Savanna Sunset drink", description: "Sip local gin and tonics on a high rocky cliff overlooking the infinite Rift Valley.", cost: "$15", location: "Rift Overlook Lodge", photoSpot: true, hiddenGem: false }
          ]
        },
        {
          theme: "Swahili Swirls of Mombasa",
          activities: [
            { time: "10:30 AM", title: "Fort Jesus Coral History", description: "Explore the massive defensive ramparts built by the Portuguese in 1593 out of local coral stone.", cost: "$15", location: "Mombasa Island", photoSpot: true, hiddenGem: false },
            { time: "02:30 PM", title: "Swahili Old Town Spice Walk", description: "Wander past historical carved balconies, smelling heavy cardamom, cloves, and ginger.", cost: "Free", location: "Mombasa Spice Market", photoSpot: true, hiddenGem: true },
            { time: "06:30 PM", title: "Priscilla Dhow Seafood cruise", description: "Sail past ancient harbors on a wooden dhow boat, eating ginger crab claws with coconut rice.", cost: "$55", location: "Tudor Creek Harbour", photoSpot: false, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `Jambo from the plains of the Maasai Mara. Today, I watched majestic elephant herds cross the golden savanna at dawn, learned ancient tracking rituals from Maasai warriors, and sailed on a wooden Swahili dhow past old coral fortresses. The wild orange sunsets here are absolute poetry. Traveling offline, perfectly planned.`
    };
  }

  // 7. Egypt (Nile & Pyramids)
  else if (destLower.includes("egypt") || destLower.includes("pyramid") || destLower.includes("giza") || destLower.includes("nile")) {
    config = {
      currency: "EGP",
      exchangeRate: "1 USD = 47.5 EGP",
      rateLabel: "1 USD = 47.5 EGP",
      totalEst: "$1,950",
      flightCost: "$650",
      hotelCost: "$700",
      activitiesCost: "$300",
      transportCost: "$150",
      foodCost: "$150",
      recommendedMonths: "October - April",
      avgTemp: "28°C / 82°F",
      weatherCondition: "Desert Sunshine",
      weatherDetails: "Dry, hot desert climate with pleasant cooler evenings. Carry loose cotton clothing, a wide-brimmed sun hat, and stay hydrated.",
      passportStamp: "CAI-2026",
      police: "122",
      medical: "123",
      localEtiquetteTips: [
        "Avoid public displays of affection; Egypt is a conservative Islamic society.",
        "Always hire official, licensed Egyptologists and dragoman guides to avoid aggressive hawkers.",
        "It is highly customary to offer a small 'baksheesh' (tip) for photography help or driver service."
      ],
      localEtiquette: [
        { rule: "Respectful Photography", explanation: "Never take photographs of military sites, bridges, or police checkpoints." },
        { rule: "Modest Temple Wear", explanation: "Cover shoulders and knees when visiting mosques and archaeological ruins." }
      ],
      hiddenGems: [
        { name: "Tomb of Mereruka inner chamber", description: "A beautifully preserved private tomb in Saqqara displaying intricate carvings of ancient hunting scenes and crocodiles.", whySpecial: "Avoids 98% of the tour bus congestion; colors are extremely vivid after 4,000 years." },
        { name: "El Moez Street lantern bazaar", description: "A medieval Cairo thoroughfare packed with beautiful brass lamps, incense burners, and stone archways.", whySpecial: "Transforms into a glowing medieval wonderland after the evening call to prayer." }
      ],
      photoSpots: [
        { spot: "The Nine Pyramids Overlook", bestTime: "Sunrise (5:30 AM)", tip: "Take a short horse or camel ride to the high desert ridge west of Giza to align all nine pyramids in a single frame." },
        { spot: "Luxor Temple Colonnade", bestTime: "Twilight (6:30 PM)", tip: "Photograph the giant columns of Amenhotep III as the amber spotlighting illuminates the historic hieroglyphics." }
      ],
      dayTemplates: [
        {
          theme: "Colossal Sands of Giza",
          activities: [
            { time: "08:00 AM", title: "Great Pyramid Close Inspection", description: "Stand directly beneath the massive 2.5-ton limestone blocks of Khufu's pyramid.", cost: "$20", location: "Giza Plateau", photoSpot: true, hiddenGem: false },
            { time: "11:30 AM", title: "The Great Sphinx Valley Walk", description: "Walk around the legendary lion-bodied stone guardian of the pharaohs.", cost: "$10", location: "Sphinx Entrance", photoSpot: true, hiddenGem: false },
            { time: "07:30 PM", title: "Rooftop Nile Herb Dinner", description: "Enjoy Egyptian kofta skewers and warm fresh Aish Baladi bread overlooking the illuminated pyramids.", cost: "$25", location: "Giza Overlook Bistro", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Luxor Valley of the Kings",
          activities: [
            { time: "06:00 AM", title: "Fly to Ancient Thebes", description: "Board a short domestic flight to Luxor. Cross the Nile to the West Bank.", cost: "$90", location: "Cairo Main Terminal", photoSpot: false, hiddenGem: false },
            { time: "09:30 AM", title: "Valley of the Kings tomb walk", description: "Descend into the underground royal tombs. See vivid paints untouched by sunlight for millennia.", cost: "$25", location: "Luxor West Bank", photoSpot: true, hiddenGem: false },
            { time: "03:30 PM", title: "Karnak Temple Papyrus Columns", description: "Walk among 134 giant stone columns towering 70 feet high in the grand hypostyle hall.", cost: "$15", location: "Luxor East Bank", photoSpot: true, hiddenGem: true }
          ]
        },
        {
          theme: "Nile River Felucca Drifting",
          activities: [
            { time: "10:00 AM", title: "Traditional Felucca Sailing", description: "Glide down the Nile on a wooden sailboat powered strictly by the river wind.", cost: "$30", location: "Luxor Nile Docks", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Nubian Village Spice tour", description: "Taste fresh hibiscus tea and browse natural indigo, saffron, and sandalwood powders.", cost: "$15", location: "Aswan Island", photoSpot: false, hiddenGem: true },
            { time: "07:00 PM", title: "Legacy Palace Culinary Feast", description: "Dine on slow-cooked pigeon stuffed with green wheat inside a grand historic palace hall.", cost: "$40", location: "Luxor Palace Gardens", photoSpot: false, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `Greetings from the historic shores of the Nile. Today, I stood before the colossal stone blocks of the Giza Pyramids, descended into the painted tombs of ancient pharaohs, and sailed down the Nile on a traditional wooden felucca at sunset. The history is raw, tangible, and completely magical.`
    };
  }

  // 8. Antarctica
  else if (destLower.includes("antarctica") || destLower.includes("antarctic") || destLower.includes("drake") || destLower.includes("peninsula")) {
    config = {
      currency: "ICE",
      exchangeRate: "1 USD = 1 ICE",
      rateLabel: "1 USD = 1 ICE",
      totalEst: "$7,200",
      flightCost: "$2,200",
      hotelCost: "$3,500",
      activitiesCost: "$1,000",
      transportCost: "$300",
      foodCost: "$200",
      recommendedMonths: "November - March",
      avgTemp: "-2°C / 28°F",
      weatherCondition: "Glacial Crisp",
      weatherDetails: "Extreme polar conditions. Heavy freezing wind-chill. Highly protective thermal outer layers, polar boots, and face goggles are mandatory.",
      passportStamp: "ANT-2026",
      police: "Vessel Captain",
      medical: "Vessel Surgeon",
      localEtiquetteTips: [
        "Maintain a minimum 5-meter (15 feet) distance from all penguins and marine seals.",
        "Always thoroughly disinfect your boots before and after landing on pristine icy terrain.",
        "Strictly carry out all personal waste; do not leave even a single trace on the continent."
      ],
      localEtiquette: [
        { rule: "Wildlife Right-of-Way", explanation: "Penguins always have absolute right-of-way. If they approach you, stand perfectly still." },
        { rule: "No Bio-Contamination", explanation: "Do not sit or kneel on the snow to prevent transferring any foreign microbes." }
      ],
      hiddenGems: [
        { name: "Deception Island thermal sand", description: "An active volcanic caldera where geothermal springs warm up black volcanic sand beaches under icy cliffs.", whySpecial: "A rare spot where steam rises directly from freezing black sands next to old whaling skeletons." },
        { name: "Port Lockroy historic post office", description: "A British research base turned historical museum and the southernmost operating post office on Earth.", whySpecial: "You can send real letters stamped with an Antarctic seal directly to your family." }
      ],
      photoSpots: [
        { spot: "Neko Harbour Glacial Face", bestTime: "Afternoon (2:30 PM)", tip: "Use a telephoto lens to capture massive blue icebergs calving off the glacier into the mirroring gray water." },
        { spot: "Lemaire Channel Deck View", bestTime: "Twilight (9:00 PM)", tip: "Settle on the ship bow to capture the sheer vertical black cliffs on both sides closing in to a narrow 1,600-foot gap." }
      ],
      dayTemplates: [
        {
          theme: "Crossing the Drake Abyss",
          activities: [
            { time: "09:00 AM", title: "Sailing through Drake Passage", description: "Cross the convergence zone where oceans collide. Watch giant wandering albatrosses glide past the deck.", cost: "Free", location: "Expedition Vessel Deck", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Polar Glaciology Briefing", description: "Attend an intimate lecture by expert polar geologists regarding tabular icebergs.", cost: "Free", location: "Ship Science Lounge", photoSpot: false, hiddenGem: false },
            { time: "07:30 PM", title: "Captain's Welcome Feast", description: "Dine on high-end salmon and premium steak while observing ocean swell patterns.", cost: "$40", location: "Vessel Dining Room", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Looming Ice & Penguin Colonies",
          activities: [
            { time: "08:30 AM", title: "Zodiac Boat Ice Cruise", description: "Weave between massive turquoise tabular icebergs. Settle near floating ice floes hosting leopard seals.", cost: "$150", location: "Pleneau Island Bay", photoSpot: true, hiddenGem: false },
            { time: "01:30 PM", title: "Gentoo Penguin Landing Walk", description: "Set foot on the Antarctic continent. Walk among thousands of nesting, squawking Gentoo penguins.", cost: "Free", location: "Neko Harbour Continent Landing", photoSpot: true, hiddenGem: false },
            { time: "06:30 PM", title: "Volcanic Sand Beach Exploration", description: "Walk past abandoned historic oil barrels on Deception Island's steam-shrouded black sand beach.", cost: "Free", location: "Deception Island Caldera", photoSpot: true, hiddenGem: true }
          ]
        },
        {
          theme: "Polar Plunges & Quiet Fjords",
          activities: [
            { time: "10:00 AM", title: "The Antarctic Polar Plunge", description: "Brave the absolute cold by jumping into 1°C waters secured by a safety harness.", cost: "Free", location: "Orne Harbour Bay", photoSpot: true, hiddenGem: false },
            { time: "02:30 PM", title: "Port Lockroy Seal Post Office", description: "Visit the tiny historical tin hut museum. Write postcards to send home through the ice mail.", cost: "$15", location: "Goudier Island", photoSpot: false, hiddenGem: true },
            { time: "07:30 PM", title: "Glacier Ridge Silent Reflection", description: "Sit quietly on a high snow ridge, listening to the deep thunder of calving glaciers across the quiet bay.", cost: "Free", location: "Damoy Point", photoSpot: true, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `I am writing this from a tiny British research hut at the bottom of the world. Today, I sailed past massive neon-blue icebergs on a Zodiac boat, walked amidst thousands of penguins on the Antarctic continent, and braced the icy cold polar plunge. The sheer scale, silence, and crisp pure air here is unlike anything else on Earth.`
    };
  }

  // 9. Svalbard Arctic Wilderness
  else if (destLower.includes("svalbard") || destLower.includes("norway") || destLower.includes("longyearbyen") || destLower.includes("arctic")) {
    config = {
      currency: "NOK",
      exchangeRate: "1 USD = 10.8 NOK",
      rateLabel: "1 USD = 10.8 NOK",
      totalEst: "$3,100",
      flightCost: "$950",
      hotelCost: "$1,200",
      activitiesCost: "$500",
      transportCost: "$250",
      foodCost: "$200",
      recommendedMonths: "February - May & June - August",
      avgTemp: "-5°C / 23°F",
      weatherCondition: "Arctic Crisp",
      weatherDetails: "Dry arctic freeze. Midnight sun in summer, polar nights with dramatic Aurora Borealis in winter. Sturdy insulated boots and face layers are vital.",
      passportStamp: "LYR-2026",
      police: "112",
      medical: "113",
      localEtiquetteTips: [
        "Never venture beyond the yellow 'Polar Bear' warning signs of Longyearbyen without an armed guard guide.",
        "It is standard custom to take off your heavy outdoor boots when entering hotels, libraries, and museums.",
        "Do not step on or pick the delicate tundra mosses; they take decades to recover in cold climates."
      ],
      localEtiquette: [
        { rule: "Polar Bear Security", explanation: "Always carry active flare guns and heavy rifles if leaving the settlement boundaries." },
        { rule: "Slipper Custom", explanation: "Longyearbyen has a deep shoe-removal custom from ancient coal mining days. Use wool slippers." }
      ],
      hiddenGems: [
        { name: "Ny-Ålesund Northernmost Post Office", description: "An active international research settlement hosting the world's northernmost post office and Amundsen's airship mast.", whySpecial: "Surrounded by vertical glaciers and completely void of WiFi or cell signals to protect radio research." },
        { name: "Adventfjorden Coal Mine No. 3", description: "An abandoned, historic dark hillside coal mine preserved exactly as it was when the miners left.", whySpecial: "You can crawl into the extremely narrow coal seams wearing authentic miners' lamps." }
      ],
      photoSpots: [
        { spot: "Longyearbyen Colored Row Houses", bestTime: "Golden Hour (11:30 PM in summer)", tip: "Frame the famous multicolored wooden arctic row houses against the massive, barren, snow-streaked mountain of Platåberget." },
        { spot: "Svea Glacier Wall", bestTime: "Morning (9:30 AM)", tip: "Photograph the blue, rugged glacial wall reflecting in the mirror-flat ocean waters from an open rib boat." }
      ],
      dayTemplates: [
        {
          theme: "Arctic Frontier Longyearbyen",
          activities: [
            { time: "11:00 AM", title: "Arctic Museum Coal Walk", description: "See giant taxidermied polar bears and learn about early polar expeditions.", cost: "$15", location: "Longyearbyen Museum", photoSpot: true, hiddenGem: false },
            { time: "03:00 PM", title: "Crawl into Coal Mine No. 3", description: "Wear a protective helmet and lamp. Explore deep historical tunnels inside the dark mountain.", cost: "$40", location: "Mine No. 3", photoSpot: true, hiddenGem: true },
            { time: "07:00 PM", title: "Smoked Reindeer Fjord Dinner", description: "Enjoy slow-roasted reindeer steak and cloudberries inside a cozy timber cabin.", cost: "$45", location: "Gruvelageret dining room", photoSpot: false, hiddenGem: false }
          ]
        },
        {
          theme: "Husky Dog Sledding & Ice Floes",
          activities: [
            { time: "09:00 AM", title: "Mush your own Husky Sled", description: "Harness a team of vocal, active Alaskan huskies. Mush across the dramatic frozen valleys.", cost: "$120", location: "Bolterdalen Valley", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Fjord Cruise past Svea Glacier", description: "Sail on an open RIB boat. Watch walruses resting on blue ice floes.", cost: "$95", location: "Adventfjorden Docks", photoSpot: true, hiddenGem: true },
            { time: "06:30 PM", title: "Local Craft Brewery Tasting", description: "Taste stout beer brewed with 2000-year-old glacier water at the world's northernmost brewery.", cost: "$25", location: "Svalbard Bryggeri", photoSpot: false, hiddenGem: false }
          ]
        },
        {
          theme: "Northern Lights & Frozen Tundra",
          activities: [
            { time: "10:00 AM", title: "Frozen Tundra Reindeer Trek", description: "Hike the rocky valleys looking for short-legged Svalbard reindeer and white arctic foxes.", cost: "$35", location: "Sarkofagen Ridge", photoSpot: true, hiddenGem: false },
            { time: "03:30 PM", title: "Arctic Greenhouse Seed Vault view", description: "Stand near the futuristic, glowing concrete entrance of the Global Seed Vault nested inside the mountain.", cost: "Free", location: "Svalbard Seed Vault road", photoSpot: true, hiddenGem: true },
            { time: "08:30 PM", title: "Snowmobile Northern Lights Hunt", description: "Drive deep into the dark polar night. Watch the glowing green curtains of Aurora Borealis dance above.", cost: "$110", location: "Adventdalen Outskirts", photoSpot: true, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `Greetings from the top of the world in Svalbard. Today, I crawled through an abandoned coal mine inside a dark mountain, mushed with a team of active huskies across frozen valleys, and watched the northern lights paint the night sky. The sheer vastness, crisp arctic air, and quiet wilderness here are sublime.`
    };
  }

  // 10. Australia (Sydney & Reef)
  else if (destLower.includes("australia") || destLower.includes("sydney") || destLower.includes("barrier") || destLower.includes("cairns") || destLower.includes("reef")) {
    config = {
      currency: "AUD",
      exchangeRate: "1 USD = 1.50 AUD",
      rateLabel: "1 USD = 1.50 AUD",
      totalEst: "$2,750",
      flightCost: "$900",
      hotelCost: "$1,100",
      activitiesCost: "$400",
      transportCost: "$200",
      foodCost: "$150",
      recommendedMonths: "September - November & March - May",
      avgTemp: "22°C / 72°F",
      weatherCondition: "Coastal Sunshine",
      weatherDetails: "Pleasant coastal sunshine. Sea breezes with high UV index. Wear a wide sun hat, high-protection sunscreen, and swim only between flags.",
      passportStamp: "SYD-2026",
      police: "000",
      medical: "000",
      localEtiquetteTips: [
        "Always swim strictly between the red and yellow flags; Australian beaches have extremely dangerous rip currents.",
        "Ensure your sunscreen is officially certified as reef-safe to protect sensitive coral reefs in Cairns.",
        "Keep your voice friendly, relaxed, and polite. Always thank your bus or ferry driver when leaving."
      ],
      localEtiquette: [
        { rule: "Flag Compliance", explanation: "Do not venture past the red and yellow flags. Professional lifeguards patrol this zone exclusively." },
        { rule: "Reef Protection", explanation: "Never touch or stand on living corals. A tiny kick can destroy decades of fragile growth." }
      ],
      hiddenGems: [
        { name: "Wendy's Secret Garden", description: "A beautifully lush municipal garden filled with native ferns, old giant fig trees, and hidden benches nestled behind Sydney Harbour.", whySpecial: "Avoids 99% of the busy circular quay crowds; quiet birds chirping and spectacular views of the bridge arches." },
        { name: "The Low Isles reef turtle nursery", description: "A quiet, protected coral lagoon located off Port Douglas, acting as a sanctuary for green sea turtles.", whySpecial: "Much quieter than the massive outer reef platforms; swim with turtles in chest-deep water." }
      ],
      photoSpots: [
        { spot: "Mrs Macquarie's Chair Point", bestTime: "Sunset (5:45 PM)", tip: "Stand on the sandstone ledge to perfectly align the white sails of the Opera House in front of the massive dark steel Harbour Bridge." },
        { spot: "Bondi Icebergs Pool Edge", bestTime: "Early Morning (6:30 AM)", tip: "Capture the dramatic white ocean waves crashing directly over the concrete wall of the glowing turquoise saltwater pool." }
      ],
      dayTemplates: [
        {
          theme: "Sydney Harbour sails",
          activities: [
            { time: "09:30 AM", title: "Opera House Sails walk", description: "Stroll beneath the towering white ceramic shell tiles. Feel the sea breeze of Circular Quay.", cost: "Free", location: "Bennelong Point", photoSpot: true, hiddenGem: false },
            { time: "01:30 PM", title: "Bondi to Coogee Coastal walk", description: "Hike along sheer sandstone cliffs overlooking the infinite sapphire Pacific Ocean.", cost: "Free", location: "Bondi Beachfront", photoSpot: true, hiddenGem: false },
            { time: "07:30 PM", title: "Harbour Ferry Sunset Dining", description: "Take the historic ferry to Manly. Savor freshly caught local barramundi and chilled sauvignon blanc.", cost: "$45", location: "Manly Wharf", photoSpot: false, hiddenGem: true }
          ]
        },
        {
          theme: "Great Barrier Reef Dive",
          activities: [
            { time: "08:00 AM", title: "Outer Reef Catamaran Sail", description: "Board a high-speed vessel to the outer continental shelf. Watch for jumping dolphins.", cost: "$110", location: "Cairns Marina Terminal", photoSpot: false, hiddenGem: false },
            { time: "11:00 AM", title: "Coral Gardens Snorkel & Dive", description: "Swim among glowing neon staghorn corals, clownfish, and magnificent sea turtles.", cost: "$50", location: "Agincourt Reef", photoSpot: true, hiddenGem: false },
            { time: "04:30 PM", title: "Sandy Cay Secluded Swim", description: "Land on a tiny white sandbank in the middle of the coral ocean. Swim in turquoise water.", cost: "Free", location: "Michaelmas Cay", photoSpot: true, hiddenGem: true }
          ]
        },
        {
          theme: "Daintree Rainforest Dreaming",
          activities: [
            { time: "10:00 AM", title: "Mossman Gorge Forest Walk", description: "Walk beneath ancient giant ferns and towering palms. Breathe in the damp, warm prehistoric jungle scent.", cost: "$15", location: "Daintree Rainforest Road", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Indigenous Spear-Throwing Rituals", description: "Learn traditional hunting, tracking, and herbal medicine secrets from Kuku Yalanji guides.", cost: "$40", location: "Cooya Beach", photoSpot: false, hiddenGem: true },
            { time: "06:30 PM", title: "Barramundi & Lemon Myrtle feast", description: "Dine on fresh fish seasoned with hand-foraged forest herbs inside an open timber treehouse.", cost: "$35", location: "Port Douglas", photoSpot: false, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `Greetings from the sun-drenched coast of Australia. Today, I walked beneath the glowing sails of the Sydney Opera House, snorkeled among neon corals and green turtles on the Great Barrier Reef, and walked through the ancient Daintree Rainforest. The lifestyle is incredibly relaxed, coastal, and pure.`
    };
  }

  // 11. New Zealand
  else if (destLower.includes("zealand") || destLower.includes("nz") || destLower.includes("queenstown") || destLower.includes("milford")) {
    config = {
      currency: "NZD",
      exchangeRate: "1 USD = 1.63 NZD",
      rateLabel: "1 USD = 1.63 NZD",
      totalEst: "$2,800",
      flightCost: "$950",
      hotelCost: "$1,100",
      activitiesCost: "$450",
      transportCost: "$150",
      foodCost: "$150",
      recommendedMonths: "November - April",
      avgTemp: "14°C / 57°F",
      weatherCondition: "Pure Alpine Air",
      weatherDetails: "Crisp, pristine alpine climate. Rapid weather shifts in fiord valleys. Heavy layers and high-quality rainwear are highly advised.",
      passportStamp: "ZQN-2026",
      police: "111",
      medical: "111",
      localEtiquetteTips: [
        "Show deep respect for Maori landmarks and cultural protocols (always respond with 'Kia Ora' greeting).",
        "Thoroughly wash and disinfect your hiking boots at cleaning stations to protect native kauri forest trees from disease.",
        "Keep to marked paths; New Zealanders take nature conservation extremely seriously."
      ],
      localEtiquette: [
        { rule: "Tiaki Promise", explanation: "Commit to caring for New Zealand: protect nature, keep water clean, and travel safely." },
        { rule: "Drive with Care", explanation: "Many mountain roads are extremely narrow, steep, and unsealed. Pull over to let others pass." }
      ],
      hiddenGems: [
        { name: "Glenorchy Willow Lagoon", description: "A quiet, mirror-flat marsh lagoon lined with beautiful willow trees, surrounded by massive, snow-capped peaks.", whySpecial: "Used in LOTR movies; extremely peaceful reflections and zero tourist buses." },
        { name: "Key Summit secret tarn overlook", description: "A steep uphill trail branch leading to a small, pristine mountain tarn reflecting the massive peaks of Fiordland.", whySpecial: "Avoid the main Milford sound road; quiet alpine moss, sub-alpine plants, and complete silence." }
      ],
      photoSpots: [
        { spot: "Milford Sound Mitre Peak Shoreline", bestTime: "Sunrise (6:15 AM)", tip: "Stand on the rocky low-tide shoreline to capture the massive triangular shape of Mitre Peak reflecting in the glassy fiord water." },
        { spot: "Skyline Gondola Summit Overlook", bestTime: "Sunset (8:30 PM)", tip: "Capture Queenstown's colorful street grid curving around the blue Lake Wakatipu beneath the jagged peaks of the Remarkables." }
      ],
      dayTemplates: [
        {
          theme: "Queenstown Alpine settle",
          activities: [
            { time: "10:30 AM", title: "Earnslaw Steamship Lake Cruise", description: "Board a historic 1912 coal-fired steamship. Cruise across the deep blue waters of Lake Wakatipu.", cost: "$35", location: "Steamer Wharf", photoSpot: true, hiddenGem: false },
            { time: "02:30 PM", title: "Glenorchy Beech Forest Walk", description: "Stroll along flat wooden paths surrounded by ancient mossy beech trees. Breathe in the pure, cold air.", cost: "Free", location: "Glenorchy Lagoon", photoSpot: true, hiddenGem: true },
            { time: "07:00 PM", title: "Local Venison & Pinot Noir Feast", description: "Savor slow-roasted Otago venison steak paired with a rich regional pinot noir wine.", cost: "$45", location: "Queenstown Mall", photoSpot: false, hiddenGem: false }
          ]
        },
        {
          theme: "Milford Road Fiords",
          activities: [
            { time: "07:00 AM", title: "Milford Road Scenic Drive", description: "Drive through towering moss-covered mountain valleys, passing deep mirroring lakes.", cost: "$40", location: "Te Anau highway", photoSpot: true, hiddenGem: false },
            { time: "11:30 AM", title: "Milford Sound Glacial Cruise", description: "Board a small vessel. Cruise directly beneath Stirling Falls, feeling the freezing glacial water spray.", cost: "$75", location: "Milford sound terminal", photoSpot: true, hiddenGem: false },
            { time: "04:30 PM", title: "Homer Tunnel High Peak stop", description: "Stop at the sheer rock wall entrance of the 1.2km hand-carved tunnel. Watch for cheeky native Kea parrots.", cost: "Free", location: "Homer Tunnel car park", photoSpot: true, hiddenGem: true }
          ]
        },
        {
          theme: "Queenstown Skyline Heights",
          activities: [
            { time: "10:00 AM", title: "Skyline Steep Cable Car climb", description: "Ride the steepest gondola in the Southern Hemisphere. Walk the pine ridge loops.", cost: "$25", location: "Brecon Street", photoSpot: true, hiddenGem: false },
            { time: "02:00 PM", title: "Arrowtown Gold-Mining Stroll", description: "Explore the historical Chinese miners' stone huts under giant golden willow trees.", cost: "Free", location: "Arrowtown Loop", photoSpot: true, hiddenGem: true },
            { time: "07:30 PM", title: "Remarkables Sunset steakhouse", description: "Dine on grass-fed beef cooked over hot stone grills overlooking the Remarkables range.", cost: "$50", location: "Skyline Observatory Restaurant", photoSpot: false, hiddenGem: false }
          ]
        }
      ],
      postcardBody: `Kia Ora from New Zealand's alpine heart. Today, I cruised across deep blue lakes on a century-old steamship, saw Milford Sound's towering granite cliffs emerge from the morning mist, and dined overlooking the Remarkables mountain range. The air is the purest I have ever breathed. Truly sublime.`
    };
  }

  // Compile day-by-day itinerary timeline up to requested duration
  const timeline: any[] = [];
  for (let d = 1; d <= duration; d++) {
    // Pick from templates cyclically to fill requested duration
    const templateIndex = (d - 1) % config.dayTemplates.length;
    const template = config.dayTemplates[templateIndex];
    
    // Deep clone and update day index
    const activities = template.activities.map((act) => {
      // customize description dynamically according to traveler profile for high fidelity feel
      let customizedDesc = act.description;
      if (food !== "Any" && act.title.toLowerCase().includes("feast") || act.title.toLowerCase().includes("dinner") || act.title.toLowerCase().includes("bistro")) {
        customizedDesc += ` Tailored with a focus on your preferred ${food.toLowerCase()} selections.`;
      }
      return {
        ...act,
        description: customizedDesc
      };
    });

    timeline.push({
      day: d,
      theme: template.theme,
      activities
    });
  }

  return {
    overview: {
      title: `${companion} Escape to ${dest}`,
      tagline: `Plan less. Feel more. Discover the hidden pulse of ${dest}.`,
      description: `A masterfully designed journey celebrating the natural contrasts and artisanal treasures of ${dest}. Crafted for a ${companion.toLowerCase()} explorer seeking a ${adventure.toLowerCase()} pacing. Dive into local culinary secrets, photograph dramatic viewpoints at dawn, and enjoy elegant evenings framed by pristine local scenery.`,
      travelPersonalityScore: `${interests[0] || "Aesthetic"} Seeker (97% Match)`,
      recommendedMonths: config.recommendedMonths,
      destinationName: dest
    },
    budgetBreakdown: {
      totalEstimated: config.totalEst,
      flightCost: config.flightCost,
      hotelCost: config.hotelCost,
      activitiesCost: config.activitiesCost,
      localTransportCost: config.transportCost,
      foodCost: config.foodCost,
      currency: config.currency,
      exchangeRate: config.exchangeRate
    },
    packingChecklist: [
      { item: "Elegant walking shoes (highly broken-in)", category: "Clothing" },
      { item: "Light layered windbreaker or jacket", category: "Clothing" },
      { item: "High-capacity compact power bank", category: "Electronics" },
      { item: "Refillable insulated water bottle", category: "Essentials" },
      { item: "Travel notebook / pocket sketchbook", category: "Gear" }
    ],
    currencyConverter: {
      rateLabel: config.rateLabel,
      exampleAmount: `100 USD = ${(100 * parseFloat(config.exchangeRate.split("=")[1].replace(/[^0-9.]/g, ""))).toLocaleString()} ${config.currency}`
    },
    weather: {
      averageTemp: config.avgTemp,
      condition: config.weatherCondition,
      details: config.weatherDetails
    },
    emergencyContacts: {
      police: config.police,
      medical: config.medical,
      localEtiquetteTips: config.localEtiquetteTips
    },
    timeline,
    localEtiquette: config.localEtiquette,
    hiddenGems: config.hiddenGems,
    photoSpots: config.photoSpots,
    passportStamp: config.passportStamp,
    postcard: {
      header: `Postcard from ${dest}`,
      greeting: "Greetings from across the miles,",
      body: config.postcardBody,
      signature: "Your TravelMind AI"
    }
  };
}

// Helper function to call Gemini API with automatic retries, exponential backoff, and model fallback in case of high demand (503) or rate limits (429)
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model: string;
    contents: any;
    config?: any;
  },
  maxRetries = 3
) {
  let attempt = 0;
  let delay = 1000; // start with 1s
  let lastError: any = null;

  // Support model fallback. If the primary model fails, we fall back to other robust free models.
  const modelsToTry = [params.model, "gemini-3.1-flash-lite"];

  for (const model of modelsToTry) {
    attempt = 0;
    delay = 1000;
    while (attempt < maxRetries) {
      try {
        console.log(`[Gemini API] Attempting generateContent with model: ${model}, attempt: ${attempt + 1}/${maxRetries}`);
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        attempt++;
        
        // Handle error checks (503 Service Unavailable, 429 Too Many Requests, 500, etc.)
        const errorStr = String(error?.message || error?.status || error || "");
        const isRetryable = 
          errorStr.includes("503") || 
          errorStr.includes("429") || 
          errorStr.includes("500") || 
          errorStr.toLowerCase().includes("unavailable") || 
          errorStr.toLowerCase().includes("overloaded") || 
          errorStr.toLowerCase().includes("limit") || 
          errorStr.toLowerCase().includes("rate") || 
          errorStr.toLowerCase().includes("timeout") || 
          errorStr.toLowerCase().includes("fetch failed");

        if (isRetryable && attempt < maxRetries) {
          console.warn(`[Gemini API] Recoverable error detected: "${errorStr}". Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // exponential backoff
        } else {
          console.warn(`[Gemini API] Error for model ${model} not retryable or retries exhausted: "${errorStr}"`);
          break; // Break out of inner retry loop, try next model
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content after trying primary and fallback models.");
}

// REST API Route
app.post("/api/generate-journey", async (req, res) => {
  const profile = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or left as default. Using high-fidelity offline fallback generator.");
    // Simulate thinking delay to preserve the cinematic onboarding loading animation!
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return res.json(generateOfflineJourney(profile));
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const dest = profile.destination && profile.destination.trim() !== "" ? profile.destination : "Kyoto, Japan";
    const budget = profile.budget || "Moderate";
    const duration = parseInt(profile.duration) || 5;
    const companion = profile.companion || "Solo";
    const adventure = profile.adventureLevel || "Balanced";
    const food = profile.foodPreference || "Local Street Food";
    const interests = profile.interests || ["Photography", "Hidden Gems"];
    const health = profile.healthConcerns || "None";
    const theme = profile.themePreference || "Any";

    const prompt = `
Create an award-winning, extremely detailed, and highly curated travel itinerary for: ${dest}.
Onboarding profile:
- Budget level: ${budget}
- Duration: ${duration} days
- Adventure / Activity Level: ${adventure}
- Companion context: ${companion}
- Culinary Preferences: ${food}
- Key Interests: ${interests.join(", ")}
- Health Concerns: ${health}
- Theme Preference: ${theme}

You must return a raw JSON object that satisfies this schema exactly. Ensure all fields are fully populated with genuine, high-quality descriptive text rather than placeholders. Be highly specific with local streets, train stations, specific neighborhood names, restaurants, and hidden gems.

JSON Schema:
{
  "overview": {
    "title": "A stunning, original title for the journey",
    "tagline": "A poetic, evocative tagline summarizing the spirit of the trip",
    "description": "An elegant 3-4 sentence paragraph introducing the mood, aesthetic, and vibe of the trip.",
    "travelPersonalityScore": "Name of personality + match percentage, e.g. 'Aesthetic Alchemist (98% match)'",
    "recommendedMonths": "Best season or months to visit, e.g. 'October - April'",
    "destinationName": "Clean city or country name"
  },
  "budgetBreakdown": {
    "totalEstimated": "e.g., $1,250",
    "flightCost": "e.g., $400",
    "hotelCost": "e.g., $450",
    "activitiesCost": "e.g., $150",
    "localTransportCost": "e.g., $100",
    "foodCost": "e.g., $150",
    "currency": "Standard 3-letter currency code, e.g. JPY, EUR, USD",
    "exchangeRate": "e.g., '1 USD = 150 JPY'"
  },
  "packingChecklist": [
    { "item": "specific recommended gear or clothing item based on destination & pacing", "category": "Essentials, Clothing, Gear, or Electronics" }
  ],
  "currencyConverter": {
    "rateLabel": "e.g. '1 USD = 0.92 EUR'",
    "exampleAmount": "e.g. '100 USD = 92 EUR'"
  },
  "weather": {
    "averageTemp": "e.g. 21°C / 70°F",
    "condition": "e.g. Crisp autumn breezes with clear skies",
    "details": "Details about how to dress, weather patterns, and average rain probabilities."
  },
  "emergencyContacts": {
    "police": "local emergency police contact",
    "medical": "local medical/ambulance contact",
    "localEtiquetteTips": ["3 unique etiquette rules for this specific country/city"]
  },
  "timeline": [
    {
      "day": 1,
      "theme": "Theme of this day, e.g. 'Misty Alleys & Matcha Aromas'",
      "activities": [
        {
          "time": "e.g. 10:00 AM",
          "title": "Curated Activity Name",
          "description": "Detailed description about what they will do, the story behind it, and why it fits their style.",
          "cost": "e.g. Free, or an estimated amount like $25",
          "location": "Exact street name, neighborhood, or landmark",
          "photoSpot": true,
          "hiddenGem": false
        }
      ]
    }
  ],
  "localEtiquette": [
    { "rule": "Rule title", "explanation": "Cultural background and explanation of why this is important." }
  ],
  "hiddenGems": [
    { "name": "Secret spot name", "description": "What it is", "whySpecial": "Why this beats standard tourist locations." }
  ],
  "photoSpots": [
    { "spot": "Name of viewpoint or street corner", "bestTime": "e.g. Golden Hour (5:45 PM)", "tip": "Camera setup, lighting details, or exact posture tip." }
  ],
  "passportStamp": "3-letter ISO code + current year, e.g., 'TYO-2026', 'PAR-2026', 'MIL-2026'",
  "postcard": {
    "header": "Greetings from [Destination]!",
    "greeting": "Dear Friend,",
    "body": "A beautiful, evocative, handwritten-style postcard paragraph summarizing the incredible sensory details of this destination.",
    "signature": "Your TravelMind AI"
  }
}
`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini.");
    }

    const journeyData = JSON.parse(text.trim());
    return res.json(journeyData);

  } catch (error) {
    console.error("Gemini API call failed, recovering with offline generator:", error);
    return res.json(generateOfflineJourney(profile));
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
