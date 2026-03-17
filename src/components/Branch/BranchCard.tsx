import { Link } from "react-router-dom";
import type { BranchListItem } from "../../types";
import { CoverImage } from "../shared/FallbackImage";

interface Props {
  branch: BranchListItem;
}

const BranchCard = ({ branch }: Props) => {
  return (
    <div className="overflow-hidden rounded-lg shadow-sm">
      <Link
        to={`/branch/branches/${branch._id}`}
        className="relative block aspect-[4/2] w-full bg-gray-100 sm:aspect-[16/10] lg:aspect-[16/9]"
      >
        <CoverImage
          src={branch.coverImage}
          name={branch.name}
          alt={branch.name}
          className="h-full w-full object-cover"
          showName
        />

        <div className="absolute top-0 left-0 w-full bg-black/85 p-2">
          <p className="truncate font-medium text-white">{branch.name}</p>
        </div>
      </Link>
    </div>
  );
};

export default BranchCard;
