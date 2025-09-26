'use client';

import Link from 'next/link';
import { overlay } from 'overlay-kit';
import { useAuth } from '@/contexts/AuthContext';
import Icons from '@/share/components/Icons';
import { headerStyle } from '@/share/layouts/layout.css';
import RestaurantRegisterForm from '@/components/restaurant/RestaurantForm';

export default function Header() {
  const { user } = useAuth();
  const openRegisterForm = () => {
    overlay.open(controller => (
      <RestaurantRegisterForm isOpen={controller.isOpen} close={controller.close} />
    ));
  };

  return (
    <header className={headerStyle.container}>
      <div className={headerStyle.headerLogo}></div>
      <ul className={headerStyle.filterList}>
        <li className={headerStyle.filterItem}>내용</li>
        <li className={headerStyle.filterItem} data-selected={true}>
          내용
        </li>
        <li className={headerStyle.filterItem}>
          <Icons w="bold" t="round" name="search" size={16} />
        </li>
      </ul>
      <Link href={user ? '/mypage' : '/login'} className={headerStyle.headerSearch}>
        <Icons w="solid" t="round" name="user" size={20} />
      </Link>
      <button type="button" className={headerStyle.headerSearch} onClick={openRegisterForm}>
        <Icons w="solid" t="round" name="pencil" size={20} />
      </button>
    </header>
  );
}
