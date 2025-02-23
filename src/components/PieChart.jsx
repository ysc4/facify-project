import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({ data }) {

    const facilityColors = {
        'Ampitheater': '#2B2E79',
        'E-Library': '#4D7A15',
        'Multimedia Room': '#C43C3C',
        'Multipurpose Hall': '#E9A237',
        'PE Area': '#FFD703'
      };

  return (
    <PieChart
    colors={['#2B2E79', '#4D7A15', '#C43C3C', '#E9A237', '#FFD703']}
      series={[
        {
        data: data.map((item, index) => ({
            id: index,
            value: item.count,
            label: item.facility,
            color: facilityColors[item.facility] || '#ccc', 
        })),
        innerRadius: 50,
        outerRadius: 100,
        paddingAngle: 5,
        cornerRadius: 5,
        startAngle: -45,
        endAngle: 360,
        cx: 150,
        cy: 120,
        },
      ]}
      width={550}
      height={250}
    />
  );
}