import clsx from 'clsx';

export default function ChapterMarker({
  num,
  label,
  className,
}: {
  num: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-lime',
        className
      )}
    >
      [ Chapter {num} · {label} ]
    </div>
  );
}
