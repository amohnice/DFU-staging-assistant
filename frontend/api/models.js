/**
 * Diagnostics
 * Endpoint: /api/models
 */
export default function handler(req, res) {
    res.status(200).json({
        message: 'API reachable',
        endpoints: ['/api/classify', '/api/chat', '/api/models']
    });
}
