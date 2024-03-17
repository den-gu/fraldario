import React from 'react';
import ProductCard from './productCard';

// import { Container } from './styles';

const Products: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mt-20">
        <ProductCard title="GGA" description="AGjahd" price={100} url="https://unsplash.com/photos/white-ceramic-mug-nDd3dIkkOLo" />
        <ProductCard title="GGA" description="AGjahd" price={100} url="https://unsplash.com/photos/white-ceramic-mug-nDd3dIkkOLo" />
        <ProductCard title="GGA" description="AGjahd" price={100} url="https://unsplash.com/photos/white-ceramic-mug-nDd3dIkkOLo" />
    </div>
  );
}

export default Products;