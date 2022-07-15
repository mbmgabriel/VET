import React from 'react';
import ReactDOM from 'react-dom';
import './assets/stylesheets/index.css';
import './assets/stylesheets/dashboard.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../node_modules/@fortawesome/fontawesome-free/css/all.css"
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './assets/stylesheets/calendar.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
