import { useState, useEffect } from "react";
import { fetchAllSubjectsWithPrerequisites } from "../services/api";

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchAllSubjectsWithPrerequisites()
      .then((data) => {
        if (isMounted) {
          setSubjects(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <p className="py-4 text-sm text-gray-500">
        Loading subject prerequisites...
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        Error: {error}
      </p>
    );
  }

  return (
    <div className="w-full">


      <div className="flex w-full flex-col gap-3">
        {subjects.map((subject) => (
          <div
            key={subject.code}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-sm sm:p-5"
          >
            {/* Subject name */}
            <h3 className="mb-2 break-words text-base font-semibold sm:text-lg">
              {subject.name}{" "}
              <span className="text-gray-500">
                ({subject.code})
              </span>
            </h3>

            {/* Credits */}
            <p className="mb-3 text-sm text-gray-600">
              <strong className="font-semibold text-gray-700">
                Credits:
              </strong>{" "}
              {subject.credits}
            </p>

            {/* Prerequisites */}
            <div className="text-sm">
              <strong className="font-semibold text-gray-700">
                Prerequisites:
              </strong>

              {subject.prerequisites &&
              subject.prerequisites.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                  {subject.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="break-words">
                      {prereq}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="ml-2 italic text-gray-400">
                  None
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}