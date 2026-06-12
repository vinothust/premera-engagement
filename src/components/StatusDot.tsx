import { STATUS, type StatusKey } from '../data/status'

export default function StatusDot({ status, size = 12 }: { status: StatusKey; size?: number }) {
  return (
    <span
      title={STATUS[status].label}
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
