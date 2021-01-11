import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Frame, DataM, CSVRow } from 'types';
import Plotly from 'plotly.js-dist';
import createPlotlyComponent from 'react-plotly.js/factory';
import useCsvDownloader from 'use-csv-downloader';
import { processData } from './util/process';
// import Icon from './img/save_icon.svg';
import './css/main.css';

const Plot = createPlotlyComponent(Plotly);

interface Props extends PanelProps<PanelOptions> {}
interface State {
  data: DataM[] | null;
  csvData: Array<CSVRow>;
}

export class MainPanel extends PureComponent<Props, State> {
  state: State = {
    data: null,
    csvData: [],
  };

  componentDidMount() {
    if (this.props.data.series.length > 0 && this.props.options.flat_area) {
      const series = this.props.data.series as Array<Frame>;
      const { result, csvData } = processData(series, this.props.options.flat_area);
      this.setState({ data: result, csvData });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      if (!this.props.options.flat_area) return;
      const series = this.props.data.series as Array<Frame>;

      if (series.length == 0) {
        this.setState({ data: null, csvData: [] });
        return;
      }

      const { result, csvData } = processData(series, this.props.options.flat_area);
      this.setState({ data: result, csvData });
    }

    if (prevProps.options.flat_area !== this.props.options.flat_area) {
      if (this.props.data.series.length > 0 && this.props.options.flat_area) {
        const series = this.props.data.series as Array<Frame>;
        const { result, csvData } = processData(series, this.props.options.flat_area);
        this.setState({ data: result, csvData });
      }
    }
  }

  onDownload = () => {
    const { filename } = this.props.options;
    const downloadCsv = useCsvDownloader({ quote: '', delimiter: ',' });
    downloadCsv(this.state.csvData, `${filename}.csv`);
  };

  render() {
    const { width, height } = this.props;
    const { data } = this.state;

    if (!data) return <div>No data</div>;

    return (
      <div
        style={{
          width,
          height,
          padding: 0,
        }}
      >
        {/*         <img className="scatter3d-pane" src={Icon} onClick={this.onDownload} /> */}
        <Plot
          data={data}
          layout={{
            width: width,
            height: height - 50,
            margin: {
              l: 50,
              r: 50,
              b: 0,
              t: 0,
              pad: 0,
            },
            scene: {
              aspectmode: 'auto',
              xaxis: { title: 'Duration' },
              yaxis: {
                title: 'Area',
                showticklabels: false,
                type: 'log',
              },
              zaxis: { title: 'Customer' },
              camera: {
                center: { x: 0, y: 0, z: 0 },
                eye: { x: 1.46, y: 1.58, z: 0.22 },
                up: { x: 0, y: 0, z: 1 },
              },
            },
            hoverlabel: {
              align: 'right',
              padding: {
                l: 10,
                r: 10,
                t: 10,
                b: 10,
              },
            },
          }}
          config={{ displayModeBar: false }}
        />
      </div>
    );
  }
}
