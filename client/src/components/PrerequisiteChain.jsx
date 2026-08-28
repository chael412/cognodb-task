import { useEffect, useState } from "react";
import {
  fetchPrerequisites,
  fetchAllSubjectsWithPrerequisites,
} from "../services/api";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PrerequisiteChain() {
  const [subjects, setSubjects] = useState([]);
  const [subjectCode, setSubjectCode] = useState("");
  const [chains, setChains] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingChain, setLoadingChain] = useState(false);
  const [error, setError] = useState("");

  // Load subjects for dropdown
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setLoadingSubjects(true);
        setError("");

        const data = await fetchAllSubjectsWithPrerequisites();

        setSubjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load subjects.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    loadSubjects();
  }, []);

  // Load prerequisite chain when subject changes
  useEffect(() => {
    if (!subjectCode) {
      setChains([]);
      return;
    }

    const loadPrerequisites = async () => {
      try {
        setLoadingChain(true);
        setError("");

        const data = await fetchPrerequisites(subjectCode);

        setChains(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load prerequisite chain.");
      } finally {
        setLoadingChain(false);
      }
    };

    loadPrerequisites();
  }, [subjectCode]);

  return (
    <div className="space-y-5">
      {/* Subject Selector */}
      <div className="space-y-2">
        <label className="font-semibold">
          Select Subject
        </label>

        <Select
          value={subjectCode}
          onValueChange={setSubjectCode}
          disabled={loadingSubjects}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue
              placeholder={
                loadingSubjects
                  ? "Loading subjects..."
                  : "Select a subject"
              }
            />
          </SelectTrigger>

          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem
                key={subject.code}
                value={subject.code}
              >
                {subject.code} - {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {/* Loading */}
      {loadingChain && (
        <p className="text-sm text-gray-500">
          Loading prerequisite chain...
        </p>
      )}

      {/* No subject selected */}
      {!subjectCode && !loadingSubjects && (
        <p className="text-sm text-gray-500">
          Select a subject to view its prerequisite chain.
        </p>
      )}

      {/* No prerequisites */}
      {subjectCode &&
        !loadingChain &&
        !chains.length && (
          <p className="text-sm text-gray-500">
            No prerequisite chain found for this subject.
          </p>
        )}

      {/* Prerequisite Chains */}
      {!loadingChain && chains.length > 0 && (
        <div className="space-y-4">
          {chains.map((chain, index) => (
            <div
              key={index}
              className="rounded-lg border p-4"
            >
              <p className="mb-3 font-semibold">
                Prerequisite Chain
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {chain.prerequisiteChain.map(
                  (subject, subjectIndex) => (
                    <div
                      key={subjectIndex}
                      className="flex items-center gap-2"
                    >
                      <div className="rounded-md border bg-gray-50 px-3 py-2">
                        <p className="font-medium">
                          {subject.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {subject.code}
                        </p>
                      </div>

                      {subjectIndex <
                        chain.prerequisiteChain.length - 1 && (
                        <span className="text-gray-400">
                          →
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}