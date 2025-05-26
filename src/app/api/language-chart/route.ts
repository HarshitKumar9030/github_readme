import { NextRequest } from 'next/server';
import { GET as languageStatsGET } from '@/services/languageStats';

export async function GET(request: NextRequest) {
  // Forward the request to our enhanced language stats service
  return languageStatsGET(request);
}
