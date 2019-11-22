
<h2>Setup</h2>
<ul>
  <li>
    <a>https://prometheus.io/docs/prometheus/latest/installation/</a> <br>
  </li>
  <li>
    <a>https://grafana.com/get</a>
  </li>
</ul>

<h2>Install</h2>
<ul>
  <li>Microgen collect metrics using Prometheus that can be access in http://host:port/metrics</li>
  <li>Edit prometheus.yml add localhost:4000 on targets </li>
  <li>Open grafana in localhost:8989 with default username "admin" and password "admin" </li>
  <li>Open configuration and add data source, select prometheus with url localhost:9090 </li>
  <li>Import microgen dashboard in ./monitor-dashboard.json to grafana</li>
</ul>
