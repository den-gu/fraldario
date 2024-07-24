import React from 'react'
import { Html, Text, Body, Head, Container, Preview, Heading, Tailwind, Img, Section, Link } from '@react-email/components'

const Email: React.FC = () => {
  return (
    <Html>
      <Head></Head>
      <Preview>Why should Hire Vinit Gupta!!</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container className="w-[450px] px-4 py-6 background-image relative">
          <Section className={`w-[90%] py-2 px-4 flex flex-col justify-start items-start gap-5 bg-white rounded-md shadow-md`}>
            <Text className='w-full my-1 text-start text-2xl max-w-lg font-bold text-cyan-400'>
              Highlights
              </Text>
          </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default Email