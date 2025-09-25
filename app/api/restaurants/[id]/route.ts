import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: '맛집을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('맛집 조회 오류:', error);
    return NextResponse.json(
      { error: '맛집 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      latitude,
      longitude,
      phoneNumber,
      topokkiType,
      price,
      riceKinds = [],
      sauceKinds = [],
      spiciness,
      canChangeSpicy,
      sideMenus = [],
      noodleKinds = [],
      sundaeType,
      others = [],
      recommend = [],
    } = body;

    // 맛집 정보 업데이트
    const restaurant = await prisma.restaurant.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        address,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        phoneNumber,
        topokkiType,
        price: price ? parseInt(price) : null,
        sundaeType,
        riceKinds: riceKinds,
        sauceKinds: sauceKinds,
        spiciness: spiciness ? parseInt(spiciness) : undefined,
        canChangeSpicy: canChangeSpicy,
        sideMenus: sideMenus,
        noodleKinds: noodleKinds,
        others: others,
        recommend: recommend,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('맛집 수정 오류:', error);
    return NextResponse.json(
      { error: '맛집 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.restaurant.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: '맛집이 삭제되었습니다.' });
  } catch (error) {
    console.error('맛집 삭제 오류:', error);
    return NextResponse.json(
      { error: '맛집 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}