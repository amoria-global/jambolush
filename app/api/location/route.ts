import { NextRequest, NextResponse } from 'next/server';
interface LocationData {
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}

// Get location from IP
async function getLocationFromIP(ip: string): Promise<LocationData | null> {
  try {
    if (ip === 'unknown' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.') || ip === '127.0.0.1') {
      return null;
    }

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'Amoria-Global-Tech/1.0' }
    });

    if (!response.ok) return null;
    const data = await response.json();
    if (data.error) return null;

    return {
      country: data.country_name || null,
      city: data.city || null,
      region: data.region || null,
      timezone: data.timezone || null,
      lat: data.latitude || null,
      lon: data.longitude || null,
    };
  } catch (error) {
    console.error('Location fetch error:', error);
    return null;
  }
}

// Extract client IP
function getClientIP(req: NextRequest): string {
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const xRealIP = req.headers.get('x-real-ip');
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim();
  if (cfConnectingIP) return cfConnectingIP;
  if (xRealIP) return xRealIP;
  return 'unknown';
}

// Generate session ID
function generateSessionId(ip: string, userAgent: string): string {
  const timestamp = Date.now();
  try {
    const hash = btoa(`${ip}-${userAgent}-${timestamp}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
    return hash;
  } catch {
    return `session_${timestamp}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const { page_url } = body;

    if (!page_url) {
      return NextResponse.json({
        success: false,
        message: "Page URL is required"
      }, { status: 400 });
    }

    const ip_address = getClientIP(req);
    // Get location with timeout
    let locationData: LocationData | null = null;
    try {
      locationData = await Promise.race([
        getLocationFromIP(ip_address),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ]);
    } catch (error) {
      console.warn('Location lookup failed:', error);
    }

    return NextResponse.json({
      success: true,
      message: "Visitor tracked successfully",
      data: {
        location: locationData
      }
    });

  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  } 
}
