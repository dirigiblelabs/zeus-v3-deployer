var rs = require('http/v3/rs');
var Pods = require('kubernetes/api/v1/Pods');

var DeploymentsDao = require('zeus-deployer/data/dao/Deployments');

rs.service()
	.resource('')
		.get(function(ctx, request, response) {
//			var server = 'https://192.168.99.100:8443';
//			var token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJ6ZXVzIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InpldXMtdG9rZW4tYno4N3giLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiemV1cyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjVlNWFmZDEyLTYyNGUtMTFlOC1hOGM5LTA4MDAyNzVlNmQyNyIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDp6ZXVzOnpldXMifQ.XcMNfil2s_uWRThwSEOcv8TUuJbphupVn79r-7VVeMzDJQWEvEQKvG65bs90uf01uwpVHplQdVVMcOEKQj-P3jNC5EjZmLkLtKIJeLu8T54cliPa_sfoYHasBlPEoxE0pT01nN6Jlo-rdDlO_AGbFlgd0RKJN0_nxsLA8Pn3YbNCN5yaPsGfjGpcFk8Req8tgLKzCwTwvrWNgGfnG_VJHk8LTuBDYQiaya9S3GDDMT1v-h5CAkib8k1l-vlRwJyXEJx-2weRCku9lReU4cJN19Lp_A6jDaT6KoPR6TSSn3aGa9EJtJrx8i_vs7ODf2HhbQVBBaz-xoOrnnR6omtDpw';
//
//			var podsApi = new Pods(server, token, 'zeus');
//			var pods = JSON.stringify(podsApi.list())

			var templateId = parseInt(request.getParameter('templateId'));
			var containers = DeploymentsDao.getContainers(templateId);
			var services = DeploymentsDao.getServices(templateId);
			var variables = DeploymentsDao.getVariables(templateId);
			response.println(JSON.stringify({
				'containers': containers,
				'services': services,
				'variables': variables
			}));
		})
.execute();