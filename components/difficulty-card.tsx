type Props = {
  level: string;
  description: string;
  selected: boolean;
  onSelected: () => void;
};

const selectedStyles = "ring-2 ring-yellow-500 bg-yellow-500 bg-opacity-10";
const unSelectedStyles = "hover:bg-gray-100";

export const DifficultyCard = ({
  description,
  level,
  onSelected,
  selected,
}: Props) => {
  return (
    <div
      className={`flex flex-col p-4 borde border-t-gray-200 rounded-lg cursor-pointer ${
        selected ? selectedStyles : unSelectedStyles
      }`}
      onClick={onSelected}
    >
      <h2
        className={`font-bold text-xl ${
          selected ? "text-yellow-500" : "text-black"
        }`}
      >
        {level}
      </h2>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};
