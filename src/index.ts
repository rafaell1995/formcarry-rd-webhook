import { Hono } from 'hono'

const app = new Hono()

app.post('/api/webhook', async (c: any) => {
  const rdStationToken = c.env.RS_STATION_TOKEN ?? '';
  const rdStationApiUrl = c.env.RD_STATION_API_URL ?? '';

  try {
    console.log('Request received');

    const formcarryData = await c.req.json();
    console.log('Formcarry data received:', formcarryData);

    const rdStationData = transformData(formcarryData);
    console.log('Transformed data for RD Station:', rdStationData);

	return c.text("TODO finalize implements");

    const response: any = await fetch(rdStationApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rdStationToken}`
      },
      body: JSON.stringify(rdStationData)
    });

    console.log('Response from RD Station:', response.status, await response.text());

    if (response.ok) {
      return c.text('Data sent to RD Station successfully', 200);
    } else {
      const errorText = await response.text();
      console.error('Failed to send data to RD Station:', errorText);
      return c.text(`Failed to send data to RD Station: ${errorText}`, response.status);
    }
  } 
  catch (error: any) {
    console.error('Error processing request:', error);
    return c.text(`Error processing request: ${error.message}`, 500);
  }
});

function transformData(formcarryData: any) {
	// Transforme os dados do Formcarry para o formato esperado pelo RD Station
	const payload: any = {
	  conversion_identifier: formcarryData.fields.conversion_identifier // Identificador de conversão no RD Station
	};

	// Check if fields exist and iterate over them
	if (formcarryData.fields && Array.isArray(formcarryData.fields)) {
		formcarryData.fields.forEach((field: { key: string, value: any }) => {
			payload[field.key] = field.value;
		});
	} else {
		console.warn('No fields found in formcarryData');
	}
  
	const transformedData = {
	  event_type: 'CONVERSION', // Por exemplo, tipo de evento
	  event_family: 'CDP', // Família de eventos
	  payload
	};
  
	console.log('Transformed data:', transformedData);
	return transformedData;
}

export default app;
