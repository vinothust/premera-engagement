import { STATUS, type StatusKey } from '../data/status'

export default function StatusDot({ status, size = 12, title }: { status: StatusKey; size?: number; title?: string }) {
  return (
    <span
      title={title ?? STATUS[status].label}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: STATUS[status].color,
      }}
    />
  )
}
