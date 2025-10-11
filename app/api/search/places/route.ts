import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const coordinate = searchParams.get('coordinate');

    if (!query) {
      return NextResponse.json(
        { error: '검색어가 필요합니다.' },
        { status: 400 }
      );
    }

    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: '네이버 API 설정이 필요합니다.' },
        { status: 500 }
      );
    }

    const url = new URL('https://openapi.naver.com/v1/search/local.json');
    url.searchParams.set('query', query);
    url.searchParams.set('display', '10');
    url.searchParams.set('start', '1');
    url.searchParams.set('sort', 'random');
    
    if (coordinate) {
      url.searchParams.set('coordinate', coordinate);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      throw new Error(`네이버 API 오류: ${response.status}`);
    }

    const data = await response.json();

    // 데이터 변환
    const places = data.items.map((item: {
      title: string;
      address: string;
      roadAddress: string;
      category: string;
      telephone: string;
      mapx: string;
      mapy: string;
      link: string;
    }) => ({
      title: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
      address: item.address,
      roadAddress: item.roadAddress,
      category: item.category,
      telephone: item.telephone,
      mapx: item.mapx,
      mapy: item.mapy,
      link: item.link,
    }));

    return NextResponse.json({
      total: data.total,
      start: data.start,
      display: data.display,
      items: places,
    });
  } catch (error) {
    console.error('장소 검색 오류:', error);
    return NextResponse.json(
      { error: '장소 검색에 실패했습니다.' },
      { status: 500 }
    );
  }
}