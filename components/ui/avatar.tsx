import React from 'react';
import Image from 'next/image';

interface AvatarProps {
    source: any,
    size: number
}

const Avatar = (props: AvatarProps) => {
  return (
    <div className={`project_image flex items-center justify-center bg-zinc-700 shadow-lg rounded-full overflow-hidden`}>
        <Image 
        src={props.source}
        alt=""
        width={100}
        height={100}
        quality={100}
        className='object-cover w-full h-full'
        />
    </div>
  );
}

export default Avatar;