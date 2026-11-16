# QR sin autenticación de usuario

Los mensajes NATS `generateEmployeeQr` y `scanEmployeeQr` ya no exigen
identidad, cargo ni privilegios del solicitante.

Payloads:

```json
{ "id_employee": 10 }
```

```json
{ "qrToken": "VALOR_DEVUELTO_POR_generateEmployeeQr" }
```

La lectura devuelve `visibilityLevel: "full"` y los datos del empleado
seleccionados para el QR. El QR conserva firma, propósito y caducidad de
15 minutos; no es un token de sesión Supabase.

Para probar por HTTP, desplegar también el Gateway de la rama
`feature/public-api-operations` y consultar:

```bash
curl -i -X POST 'http://localhost:3000/api/employees/10/qr'
curl -i -X POST 'http://localhost:3000/api/employees/qr/scan' \
  -H 'Content-Type: application/json' \
  -d '{"qrToken":"VALOR_DEL_QR"}'
```
