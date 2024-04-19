"use client"

import React, { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Measure from 'react-measure';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

// import { useRouter } from 'next/navigation';

import { projects } from '@/lib/projects';

const Products = () => {

    // const router = useRouter();
    const [isLoading, setLoading] = useState(true)
    const items: {id: number; name: string; desc: string; price: number}[] = []

    const loadingHandler = (loading: boolean): void => {
      setLoading(!loading)
    }

    const getProjects = async (): Promise<void> => {
      try {
        const response = await fetch('api/projects', {
          headers: {
            accept: 'application/json',
            method: 'GET'
          }
        })
        if(response) {
          const data = await response.json()
          const projects = data.projects;

          for (let i = 0; i < projects.length; i++) {
            items.push({
                id: projects[i].id,
                name: projects[i].name,
                desc: projects[i].desc,
                price: projects[i].price
          })}

          console.log(`${items[0].id} ${items[0].name}`)
          // setTimeout(() => {
            // router.push('/portfolio')
            // setLoading(!isLoading)
            // setLoading(!isLoading)
            // loadingHandler(isLoading)
          // }, 2000)
        }
      } catch(error) {
        console.log(error)
      }
    }
    getProjects()

      return (
        isLoading ? 
          (
          <p className='mt-10 text-white text-center font-bold'>Loading...</p>
        ) 
        : (
          <p className='mt-10 text-white text-center font-bold'>Data</p>
        )
      ) 
    }
    

export default Products;