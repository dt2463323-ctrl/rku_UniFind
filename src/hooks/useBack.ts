import { useLocation, useNavigate } from 'react-router-dom'

// Go back in history, or to a fallback route when the page was opened directly.
export function useBack(fallback: string) {
  const navigate = useNavigate()
  const location = useLocation()
  return () => (location.key !== 'default' ? navigate(-1) : navigate(fallback))
}
