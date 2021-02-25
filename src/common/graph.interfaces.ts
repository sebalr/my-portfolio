export interface IPieChartData {
  labels: Array<string>;
  datasets: Array<IDataset>
}

export interface IDataset {
  label: string,
  data: Array<number>,
  backgroundColor: Array<string>,
  borderColor: Array<string>,
  borderWidth: number
}
