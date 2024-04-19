import React from 'react';
import Service from './service';

const Services: React.FC = () => {
  return (
    <div id="services" className='container px-4 lg:px-8 h-auto py-24 flex flex-col'>
            <h2 className='text-3xl sm:text-4xl leading-snug font-bold text-zinc-300/85 text-center'>Discover creative <br/>and professional solutions</h2>
            {/* <p className='py-6 max-w-[80%] text-zinc-300 text-[17px] font-semibold mt-2'>Supported by a network of early advocates, contributors, and champions.</p> */}
            <div className="services_row grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 pt-16 gap-5">
                <Service
                title='Business Planning'
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quidem obcaecati delectus, minus, hic non dolorem inventore, quod praesentium quos quasi repudiandae nobis? Quod at consequatur repellendus enim, quas qui?
                Fugiat quo assumenda incidunt pariatur ex id facere error! Nobis impedit dolorum dolores. Veniam provident assumenda sunt distinctio atque neque aliquid accusamus pariatur, non eos nostrum magnam sapiente repellendus quidem?'
                tags="#ImpressãoDigital #ImpressãoPersonalizada #GráficaProfissional" />
                <Service
                title='Graphic Design'
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quidem obcaecati delectus, minus, hic non dolorem inventore, quod praesentium quos quasi repudiandae nobis? Quod at consequatur repellendus enim, quas qui?
                Fugiat quo assumenda incidunt pariatur ex id facere error! Nobis impedit dolorum dolores. Veniam provident assumenda sunt distinctio atque neque aliquid accusamus pariatur, non eos nostrum magnam sapiente repellendus quidem?'
                tags="#ImpressãoEmTecido #ImpressãoDeGrandeFormato #CoresVibrantes" />
                <Service
                title='Software Development'
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quidem obcaecati delectus, minus, hic non dolorem inventore, quod praesentium quos quasi repudiandae nobis? Quod at consequatur repellendus enim, quas qui?
                Fugiat quo assumenda incidunt pariatur ex id facere error! Nobis impedit dolorum dolores. Veniam provident assumenda sunt distinctio atque neque aliquid accusamus pariatur, non eos nostrum magnam sapiente repellendus quidem?'
                tags="#Branding #MarketingVisual #Logotipos #DesignCriativo #IdentidadeDeMarca" />
                <Service
                title='Social Media Management'
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quidem obcaecati delectus, minus, hic non dolorem inventore, quod praesentium quos quasi repudiandae nobis? Quod at consequatur repellendus enim, quas qui?
                Fugiat quo assumenda incidunt pariatur ex id facere error! Nobis impedit dolorum dolores. Veniam provident assumenda sunt distinctio atque neque aliquid accusamus pariatur, non eos nostrum magnam sapiente repellendus quidem?'
                tags="#ImpressãoEmTecido #ImpressãoDeGrandeFormato #CoresVibrantes" />
                <Service
                title='Search Engine Optimization'
                description='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat quidem obcaecati delectus, minus, hic non dolorem inventore, quod praesentium quos quasi repudiandae nobis? Quod at consequatur repellendus enim, quas qui?
                Fugiat quo assumenda incidunt pariatur ex id facere error! Nobis impedit dolorum dolores. Veniam provident assumenda sunt distinctio atque neque aliquid accusamus pariatur, non eos nostrum magnam sapiente repellendus quidem?'
                tags="#ImpressãoEmTecido #ImpressãoDeGrandeFormato #CoresVibrantes" />
            </div>
    </div>
  );
}

export default Services;