import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Tooltip, Label, ResponsiveContainer } from 'recharts';

interface PieChartProperties {
    data: {values: Array<Object>, subject: string}[],
    name: string,
    value: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieCharts: React.FC<PieChartProperties> = (props) => {
  const value = props.value
  const width = window.screen.availWidth/props.data.length
  const height = window.screen.availHeight/props.data.length
  console.log(width)
    return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart width={width} height={200}>
            {props.data.map((entry, index) =>(
              <Pie
                dataKey={value}
                data={entry.values}
                nameKey={props.name}
                cx={(width * props.data.length)< 760 ? 15+ '%' : (15 + (index * (100/props.data.length))) +'%'}
                cy={(width * props.data.length) < 760 ? (15 + (index * (100/props.data.length))) +'%' :100}
                outerRadius={70}
                innerRadius={50}
                labelLine={false}
                label = {renderCustomizedLabel}
              >
              <Label value={entry.subject} position="center" />
              {entry.values.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              </Pie>
            ))}
            <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
};

export default PieCharts;