import { PieChart, Pie, ResponsiveContainer } from 'recharts';
import styles from './FloatingCard.module.css';

const FloatingCard = (props: FloatingCardProps) => {
  const { data, title } = props;
  return (
    <div className={styles.floatingCard}>
      <div className={styles.floatingCardTitle}>
        <h2>{title}</h2>
      </div>
      <div className={styles.floatingCardGraph}>
        <PieChart width={1000} height={250}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#1db954"
          />
        </PieChart>
      </div>
      <div className={styles.floatingCardDataTable}>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>percentage %</th>
            </tr>
            {data.map((val: { name: string; percent: any }, key: any) => {
              return (
                <tr key={key}>
                  <td>{val.name}</td>
                  <td>{val.percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FloatingCard;
