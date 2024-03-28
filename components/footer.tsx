import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {

const date = new Date;

const year = date.getFullYear();

  return (
    <div id="footer" className='container pt-24 pb-16 border-t border-zinc-800'>
        <div className="wrapper flex flex-col lg:flex-row gap-16 lg:gap-0 justify-between pb-16">
        <div className="logo flex-1 flex-col max-w-[400px]">
        <a className="text-white font-bold text-[16px] me-10 flex items-center gap-2">
          <i className="ri-supabase-line text-[20px]"></i>Atemporal
          </a>
        <ul className='text-zinc-400 text-[22px] mt-10 flex items-center gap-8'>
            <li>
                <Link href="#"><i className="ri-facebook-circle-line"></i></Link>
            </li>
            <li>
                <Link href="#"><i className="ri-twitter-x-line"></i></Link>
            </li>
            <li>
                <Link href="#"><i className="ri-instagram-line"></i></Link>
            </li>
            <li>
                <Link href="#"><i className="ri-linkedin-box-line"></i></Link>
            </li>
        </ul>
        </div>
        <div id="sitemap" className='flex-1 text-zinc-400'>
            <div className="grid grid-cols-1 gap-16 md:gap-0 md:grid-cols-3">
            <ul className='flex flex-col gap-4 text-[13px]'>
                <h4 className='text-[14px] text-white font-medium'>Mais vendidos</h4>
                {/* <Link href="#" className='hover:text-zinc-100 w-fit'>Banner</Link>
                <Link href="#" className='hover:text-zinc-100 w-fit'>RollUp</Link>
                <Link href="#" className='hover:text-zinc-100 w-fit'>Sacolas</Link>
                <Link href="#" className='hover:text-zinc-100 w-fit'>Chávenas</Link> */}
                <Link href="#" className='hover:text-zinc-100 w-fit'>Sticker</Link>
            </ul>
            <ul className='flex flex-col gap-4 text-[13px]'>
                <h4 className='text-[14px] text-white font-medium'>Sobre nós</h4>
                <Link href="#" className='hover:text-zinc-100 w-fit'>Quem Somos</Link>
                <Link href="#" className='hover:text-zinc-100 w-fit'>Termos e Condições</Link>
            </ul>
            <ul className='flex flex-col gap-4 text-[13px]'>
                <h4 className='text-[14px] text-white font-medium'>Contacto</h4>
                <p>Av. da Resistência No 3519 | Maxaquene</p>
                <Link href="mailto:geral@barakat.co.mz" className='hover:text-zinc-100 w-fit'>geral@barakat.co.mz</Link>
                <Link href="tel:+258844172078" className='hover:text-zinc-100 w-fit'>(+258) 84 4172 078</Link>
            </ul>
            </div>
        </div>
        </div>
        <div className="bar border-t border-zinc-800 pt-8">
            <span className='text-zinc-300 text-[12px] font-light'>Copyright &copy; {`${year}`} - Atemporal</span>
        </div>
    </div>
  );
}

export default Footer;