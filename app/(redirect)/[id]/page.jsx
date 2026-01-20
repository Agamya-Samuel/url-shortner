// Server-side redirect page - minimal HTML, no client-side JS
export default function RedirectPage({ params }) {
    const { id } = params;
    
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="refresh" content={`0;url=/api/${id}`} />
                <title>Redirecting...</title>
                <style>{`
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: system-ui, -apple-system, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: #fff;
                    }
                    .container {
                        text-align: center;
                    }
                    .spinner {
                        width: 20px;
                        height: 20px;
                        border: 2px solid #e5e7eb;
                        border-top-color: #3b82f6;
                        border-radius: 50%;
                        animation: spin 0.6s linear infinite;
                        margin: 0 auto 12px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .text {
                        color: #6b7280;
                        font-size: 14px;
                    }
                `}</style>
                <script dangerouslySetInnerHTML={{
                    __html: `window.location.href='/api/${id}';`
                }} />
            </head>
            <body>
                <div className="container">
                    <div className="spinner"></div>
                    <div className="text">Redirecting...</div>
                </div>
            </body>
        </html>
    );
}
