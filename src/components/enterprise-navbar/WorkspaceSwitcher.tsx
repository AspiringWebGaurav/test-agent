interface WorkspaceSwitcherProps {
  name: string;
  onOpen?: () => void;
}

export function WorkspaceSwitcher({ name, onOpen }: WorkspaceSwitcherProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold hover:bg-gray-100"
      aria-label="Workspace switcher"
    >
      <span className="truncate max-w-[200px]">{name}</span>
      <svg
        className="h-4 w-4"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default WorkspaceSwitcher;
