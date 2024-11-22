import AdBillboardCarousel from '@/components/AdBillboardCarousel'
import { readJSONFile } from '@/scripts/getdata'
import React from 'react'

export const revalidate = 3600
async function Branding() {
  const brandingData = await readJSONFile('web/home.json')
  const brands = brandingData['brands']
  // const vedios = brandingData['vedios']
  console.log('Branding Data:', JSON.stringify(brandingData, null, 2))

  return (
    <div className='  w-full lg:w-8/12 mx-auto'>
      <AdBillboardCarousel ads={brands} />

    </div>
  )
}

export default Branding