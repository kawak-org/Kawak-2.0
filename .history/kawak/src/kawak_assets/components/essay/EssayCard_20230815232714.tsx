import React, { useEffect, useState } from "react";
import { convert } from "html-to-text";
import { useAppSelector } from "../../redux/hooks";
import { TagGroup, Tag } from "rsuite";
type Props = {
  annotationEnabled?: boolean;
  title?: string;
  body?: string;
  date?: string;
  author?: string;
  cost: number;
  timeToRead?: number;
  words?: number;
  reviewed: boolean;
  avatar: string;
  tags: any;
};

const EssayCard = ({
  title,
  cost,
  body,
  author,
  words,
  annotationEnabled,
  reviewed,
  avatar,
  tags,
}: Props) => {
  const text = convert(body, {
    wordwrap: 90,
  });
  const [wordLimit, setWordLimit] = useState(text.slice(0, 200));
  const user = useAppSelector((state) => state.profile);
  const [color, setColor] = useState([
    "violet",
    "blue",
    "orange",
    "yellow",
    "grey",
    "green",
    "cyan",
  ]);
  const [randomColor, setRandomColor] = useState<any>("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * color.length);
    const selectedElement = color[randomIndex];
    setRandomColor(selectedElement);
  }, []);

  // console.log(tags)

  return (
    <div className="dark:bg-[#323f4b] bg-white shadow-xl rounded-[10px] py-3 px-4 max-w-sm hover:scale-105 transition-transform duration-200 ease-in-out">
      <div className="flex flex-row justify-between items-center mt-5">
        <h2 className=" text-[#08172E] font-bold text-base dark:text-white/90 no-underline">
          {title}
        </h2>
        <div className="flex flex-row justify-center items-center">
          <img src={`wood-log.png`} className="w-[2rem]" alt="token" />
          <p className="text-[#2F6FED] ml-1 text-base">{cost}</p>
        </div>
      </div>

      <div className=" flex flex-col mt-3">
        <p className="text-[#141414] dark:text-white/70 text-sm text-ellipsis overflow-hidden no-underline">
          {wordLimit}..........
        </p>
        <div className="flex flex-row justify-between items-center my-3 flex-wrap">
          <TagGroup
            className="flex flex-row flex-wrap
          "
          >
            {tags.slice(0, 3).map((tag, index) => (
              <Tag
                key={index}
                color={
                  tag === "music"
                    ? "green"
                    : tag === "Music"
                    ? "green"
                    : tag === "art"
                    ? "green"
                    : tag === "Art"
                    ? "green"
                    : tag === "Environment"
                    ? "green"
                    : tag === "environment"
                    ? "green"
                    : tag === "studies"
                    ? "green"
                    : tag === "Studies"
                    ? "green"
                    : tag === "Health"
                    ? "green"
                    : tag === "health"
                    ? "green"
                    : tag === "wellness"
                    ? "green"
                    : tag === "Wellness"
                    ? "green"
                    : tag === "Culture"
                    ? "green"
                    : tag === "culture"
                    ? "green"
                    : tag === "Architecture"
                    ? "green"
                    : tag === "architecture"
                    ? "green"
                    : tag === "sport"
                    ? "green"
                    : tag === "Sport"
                    ? "green"
                    : tag === "Urban"
                    ? "green"
                    : tag === "urban"
                    ? "green"
                    : tag === "aesthetics"
                    ? "green"
                    : tag === "Aesthetics"
                    ? "green"
                    : tag === "Classical"
                    ? "green"
                    : tag === "classical"
                    ? "green"
                    : tag === "Cultural"
                    ? "green"
                    : tag === "cultural"
                    ? "green"
                    : tag === "heritage"
                    ? "green"
                    : tag === "Heritage"
                    ? "green"
                    : tag === "Drama"
                    ? "green"
                    : tag === "drama"
                    ? "green"
                    : tag === "Renaissance"
                    ? "green"
                    : tag === "renaissance"
                    ? "green"
                    : tag === "development"
                    ? "green"
                    : tag === "Development"
                    ? "green"
                    : tag === "planning"
                    ? "green"
                    : tag === "Planning"
                    ? "green"
                    : tag === "postmodern"
                    ? "green"
                    : tag === "Postmodern"
                    ? "green"
                    : tag === "geography"
                    ? "green"
                    : tag === "Geography"
                    ? "green"
                    : tag === "Philosophy"
                    ? "blue"
                    : tag === "philosophy"
                    ? "blue"
                    : tag === "Psychology"
                    ? "blue"
                    : tag === "psychology"
                    ? "blue"
                    : tag === "Sociology"
                    ? "blue"
                    : tag === "sociology"
                    ? "blue"
                    : tag === "Communication"
                    ? "blue"
                    : tag === "communication"
                    ? "blue"
                    : tag === "Ethics"
                    ? "blue"
                    : tag === "ethics"
                    ? "blue"
                    : tag === "Anthropology"
                    ? "blue"
                    : tag === "anthropology"
                    ? "blue"
                    : tag === "Media"
                    ? "blue"
                    : tag === "media"
                    ? "blue"
                    : tag === "Gender"
                    ? "blue"
                    : tag === "gender"
                    ? "blue"
                    : tag === "Social"
                    ? "blue"
                    : tag === "social"
                    ? "blue"
                    : tag === "Justice"
                    ? "blue"
                    : tag === "justice"
                    ? "blue"
                    : tag === "Linguistics"
                    ? "blue"
                    : tag === "Journalism"
                    ? "blue"
                    : tag === "journalism"
                    ? "blue"
                    : tag === "Critical"
                    ? "blue"
                    : tag === "critical"
                    ? "blue"
                    : tag === "Thinking"
                    ? "blue"
                    : tag === "thinking"
                    ? "blue"
                    : tag === "Law"
                    ? "blue"
                    : tag === "law"
                    ? "blue"
                    : tag === "Ethical"
                    ? "blue"
                    : tag === "ethical"
                    ? "blue"
                    : tag === "Epistemology"
                    ? "blue"
                    : tag === "epistemology"
                    ? "blue"
                    : tag === "Ontology"
                    ? "blue"
                    : tag === "Feminist"
                    ? "blue"
                    : tag === "Theory"
                    ? "blue"
                    : tag === "ontology"
                    ? "blue"
                    : tag === "theory"
                    ? "blue"
                    : tag === "feminist"
                    ? "blue"
                    : tag === "Inequality"
                    ? "blue"
                    : tag === "inequality"
                    ? "blue"
                    : tag === "Postcolonial"
                    ? "blue"
                    : tag === "postcolonial"
                    ? "blue"
                    : tag === "poststructurialism"
                    ? "blue"
                    : tag === "Poststructurialism"
                    ? "blue"
                    : tag === "Educational"
                    ? "blue"
                    : tag === "educational"
                    ? "blue"
                    : tag === "Medical"
                    ? "blue"
                    : tag === "medical"
                    ? "blue"
                    : tag === "user"
                    ? "blue"
                    : tag === "User"
                    ? "blue"
                    : tag === "experience"
                    ? "blue"
                    : tag === "Experience"
                    ? "blue"
                    : tag === "Design"
                    ? "blue"
                    : tag === "design"
                    ? "blue"
                    : tag === "Posthumanism"
                    ? "blue"
                    : tag === "posthumanism"
                    ? "blue"
                    : tag === "Neuroethics"
                    ? "blue"
                    : tag === "neuroethics"
                    ? "blue"
                    : tag === "Rhetoric"
                    ? "blue"
                    : tag === "rhetoric"
                    ? "blue"
                    : tag === "composition"
                    ? "blue"
                    : tag === "Composition"
                    ? "blue"
                    : tag === "Biomedical"
                    ? "blue"
                    : tag === "biomedical"
                    ? "blue"
                    : tag === "anthropology"
                    ? "blue"
                    : tag === "Anthropology"
                    ? "blue"
                    : tag === "Cognitive"
                    ? "blue"
                    : tag === "cognitive"
                    ? "blue"
                    : tag === "queer"
                    ? "blue"
                    : tag === "Queer"
                    ? "blue"
                    : tag === "Indigenous"
                    ? "blue"
                    : tag === "indigenous"
                    ? "blue"
                    : tag === "Sociolinguistics"
                    ? "blue"
                    : tag === "sociolinguistics"
                    ? "blue"
                    : tag === "Literature"
                    ? "red"
                    : tag === "Creative"
                    ? "red"
                    : tag === "creative"
                    ? "red"
                    : tag === "literature"
                    ? "red"
                    : tag === "Anaylsis"
                    ? "red"
                    : tag === "analysis"
                    ? "red"
                    : tag === "Romantic"
                    ? "red"
                    : tag === "Romantic"
                    ? "red"
                    : tag === "British"
                    ? "red"
                    : tag === "british"
                    ? "red"
                    : tag === "History"
                    ? "yellow"
                    : tag === "Politics"
                    ? "yellow"
                    : tag === "history"
                    ? "yellow"
                    : tag === "politics"
                    ? "yellow"
                    : tag === "education"
                    ? "yellow"
                    : tag === "Education"
                    ? "yellow"
                    : tag === "Religion"
                    ? "yellow"
                    : tag === "religion"
                    ? "yellow"
                    : tag === "Economics"
                    ? "yellow"
                    : tag === "economics"
                    ? "yellow"
                    : tag === "Globalization"
                    ? "yellow"
                    : tag === "globalization"
                    ? "yellow"
                    : tag === "Mythology"
                    ? "yellow"
                    : tag === "mythology"
                    ? "yellow"
                    : tag === "Medieval"
                    ? "yellow"
                    : tag === "medieval"
                    ? "yellow"
                    : tag === "International"
                    ? "yellow"
                    : tag === "international"
                    ? "yellow"
                    : tag === "relations"
                    ? "yellow"
                    : tag === "Relations"
                    ? "yellow"
                    : tag === "World"
                    ? "yellow"
                    : tag === "world"
                    ? "yellow"
                    : tag === "Chemistry"
                    ? "yellow"
                    : tag === "chemistry"
                    ? "yellow"
                    : tag === "Ancient"
                    ? "yellow"
                    : tag === "ancient"
                    ? "yellow"
                    : tag === "Macroeconomics"
                    ? "yellow"
                    : tag === "macroeconomics"
                    ? "yellow"
                    : tag === "Behavioural"
                    ? "yellow"
                    : tag === "behavioural"
                    ? "yellow"
                    : tag === "Public"
                    ? "yellow"
                    : tag === "public"
                    ? "yellow"
                    : tag === "Biology"
                    ? "yellow"
                    : tag === "biology"
                    ? "yellow"
                    : tag === "Physics"
                    ? "yellow"
                    : tag === "physics"
                    ? "yellow"
                    : tag === "Neuroscience"
                    ? "yellow"
                    : tag === "neuroscience"
                    ? "yellow"
                    : tag === "Intellectual"
                    ? "yellow"
                    : tag === "intellectual"
                    ? "yellow"
                    : tag === "African"
                    ? "yellow"
                    : tag === "african"
                    ? "yellow"
                    : tag === "Science"
                    ? "orange"
                    : tag === "science"
                    ? "orange"
                    : tag === "Mathematics"
                    ? "orange"
                    : tag === "mathematics"
                    ? "orange"
                    : tag === "Ecological"
                    ? "orange"
                    : tag === "ecological"
                    ? "orange"
                    : tag === "Systems"
                    ? "orange"
                    : tag === "systems"
                    ? "orange"
                    : tag === "Human"
                    ? "orange"
                    : tag === "human"
                    ? "orange"
                    : tag === "Frontend"
                    ? "orange"
                    : tag === "frontend"
                    ? "orange"
                    : tag === "Backend"
                    ? "orange"
                    : tag === "backend"
                    ? "orange"
                    : tag === "coding"
                    ? "violet"
                    : tag === "Coding"
                    ? "violet"
                    : tag === "Technology"
                    ? "violet"
                    : tag === "technology"
                    ? "violet"
                    : tag === "Game"
                    ? "violet"
                    : tag === "game"
                    ? "violet"
                    : tag === "gaming"
                    ? "violet"
                    : tag === "Gaming"
                    ? "violet"
                    : tag === "Web development"
                    ? "violet"
                    : tag === "web development"
                    ? "violet"
                    : tag === "Cybersecurity"
                    ? "violet"
                    : tag === "cybersecurity"
                    ? "violet"
                    : tag === "Digital"
                    ? "violet"
                    : tag === "Database"
                    ? "violet"
                    : tag === "database"
                    ? "violet"
                    : tag === "web"
                    ? "violet"
                    : tag === "Web"
                    ? "violet"
                    : tag === "Crypotography"
                    ? "violet"
                    : tag === "cryptography"
                    ? "violet"
                    : tag === "Software"
                    ? "violet"
                    : tag === "software"
                    ? "violet"
                    : tag === "Ux"
                    ? "violet"
                    : tag === "ux"
                    ? "violet"
                    : tag === "ui"
                    ? "violet"
                    : tag === "Ui"
                    ? "violet"
                    : tag === "Blockchain"
                    ? "violet"
                    : tag === "blockchain"
                    ? "violet"
                    : tag === "Engineering"
                    ? "violet"
                    : tag === "engineering"
                    ? "violet"
                    : "cyan"
                }
              >
                {tag}
              </Tag>
            ))}
          </TagGroup>

          <span className="w-full mt-1 text-xs text-gray-400  flex items-center justify-end flex-row">
            {words} words
          </span>
        </div>
      </div>

      <div className="border-b-2 bg-gray-400 my-3" />

      <div className="flex flex-row justify-between items-center ">
        <div className="flex flex-row">
          <img
            className="cursor-pointer w-10 h-10 dark:bg-[#303c48] bg-white rounded-full py-1 px-1"
            src={avatar}
            alt="avatar"
          />
          <span className="ml-3 flex flex-col justify-between ">
            {annotationEnabled && (
              <h2 className=" text-[#08172E] font-bold dark:text-white/90 text-sm">
                {author}
              </h2>
            )}
            <p className="text-gray-400 text-xs">Author</p>
          </span>
        </div>

        <div className="">
          {reviewed ? (
            <p className="text-[#08875D]  text-sm font-medium ">Reviewed</p>
          ) : (
            <p className="text-[#EF4444]  text-sm font-medium ">Not Reviewed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EssayCard;
