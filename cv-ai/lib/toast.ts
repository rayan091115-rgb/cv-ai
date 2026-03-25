// lib/toast.ts
// Toast minimal sans dépendance externe

type ToastType = 'success' | 'error' | 'info'

export function showToast(message: string, type: ToastType = 'info') {
  const existing = document.getElementById('cv-toast')
  if (existing) existing.remove()

  const toast = document.createElement('div')
  toast.id = 'cv-toast'
  const colors = {
    success: 'background:#ECFDF5;color:#065F46;border-color:#A7F3D0',
    error:   'background:#FEF2F2;color:#991B1B;border-color:#FECACA',
    info:    'background:#EFF6FF;color:#1D4ED8;border-color:#BFDBFE',
  }
  toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    padding:12px 16px;border-radius:10px;border:1px solid;
    font-family:var(--font-plus-jakarta,sans-serif);font-size:13px;font-weight:500;
    box-shadow:0 4px 16px rgba(0,0,0,0.1);max-width:320px;
    animation:slideIn 0.2s ease;
    ${colors[type]}
  `
  toast.textContent = message

  const style = document.createElement('style')
  style.textContent = '@keyframes slideIn{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}'
  document.head.appendChild(style)
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 4000)
}
