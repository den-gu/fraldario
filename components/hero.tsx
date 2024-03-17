import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse px-16">
                <img src="https://daisyui.com/images/stock/photo-1635805737707-575885ab0820.jpg" className="max-w-sm rounded-lg shadow-2xl" />
                <div>
                    <h1 className="text-5xl font-bold max-w-[60%]">Imprimir online nunca foi tão fácil assim!</h1>
                    <p className="py-6 max-w-[60%]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Unde dolore recusandae dolorum exercitationem consectetur, dolorem molestiae aliquid iste animi voluptas.</p>
                    <button className="btn btn-primary">Saiba mais</button>
                </div>
            </div>
        </div>
    );
}

export default Hero;