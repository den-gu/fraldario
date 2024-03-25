import React from 'react';
import Service from './service';

const Services: React.FC = () => {
  return (
    <div id="services" className='container h-auto xl:h-screen py-4 items-center flex flex-col'>
            <h2 className='text-3xl font-bold text-zinc-300/85 text-center'>Descubra nossas soluções <br/>criativas e profissionais</h2>
            {/* <p className='py-6 max-w-[80%] text-zinc-300 text-[17px] font-semibold mt-2'>Supported by a network of early advocates, contributors, and champions.</p> */}
            <div className="services_row grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pt-16 gap-5">
                <Service
                title='Serviços de Gráfica'
                description='Impressão de alta qualidade em uma variedade de materiais e formatos para atender às necessidades de impressão de pequenas a grandes tiragens.'
                tags="#ImpressãoDigital #ImpressãoPersonalizada #GráficaProfissional" />
                <Service
                title='Serviços de Serigrafia'
                description='Técnica de impressão versátil, ideal para materiais rígidos e flexíveis, oferecendo cores vibrantes e durabilidade.'
                tags="#ImpressãoEmTecido #ImpressãoDeGrandeFormato #CoresVibrantes" />
                <Service
                title='Design Gráfico'
                description='Desenvolvimento de identidade visual, logotipos e materiais de marketing personalizados para comunicar efetivamente a mensagem da marca.'
                tags="#Branding #MarketingVisual #Logotipos #DesignCriativo #IdentidadeDeMarca" />
                <Service
                title='Acabamento Especial'
                description='Adição de elementos de acabamento como laminação, verniz localizado e relevo para criar impressões sofisticadas e impactantes.'
                tags="#ImpressãoEmTecido #ImpressãoDeGrandeFormato #CoresVibrantes" />
            </div>
    </div>
  );
}

export default Services;