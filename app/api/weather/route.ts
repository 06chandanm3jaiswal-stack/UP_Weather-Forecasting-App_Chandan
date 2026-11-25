import {NextRequest,NextResponse} from "next/server";
export async function GET(req:NextRequest){
const district=req.nextUrl.searchParams.get("district")||"";if(!district)return NextResponse.json({error:"Choose district"},{status:400});
try{
const gr=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+encodeURIComponent(district+" Uttar Pradesh")+"&count=10&language=en&format=json");const g=await gr.json();
const loc=g.results?.find((x:any)=>x.country_code==="IN"&&(x.admin1||"").toLowerCase().includes("uttar pradesh"))||g.results?.find((x:any)=>x.country_code==="IN");if(!loc)throw Error("Could not locate district");
const base={latitude:String(loc.latitude),longitude:String(loc.longitude),timezone:"Asia/Kolkata"};
const wp=new URLSearchParams({...base,current:"temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",daily:"weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",forecast_days:"5"});
const ap=new URLSearchParams({...base,current:"us_aqi,pm2_5,pm10"});
const [wr,ar]=await Promise.all([fetch("https://api.open-meteo.com/v1/forecast?"+wp),fetch("https://air-quality-api.open-meteo.com/v1/air-quality?"+ap)]);if(!wr.ok)throw Error("Weather API unavailable");
return NextResponse.json({district,place:loc,weather:await wr.json(),air:ar.ok?await ar.json():null,updated:new Date().toISOString()});
}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Weather unavailable; retry shortly."},{status:502})}}
