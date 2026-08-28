import { useState } from "react";
import PeerNetwork from "./components/PeerNetwork";
import SubjectList from "./components/SubjectList";
import PrerequisiteChain from "./components/PrerequisiteChain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function App() {
  const [studentId, setStudentId] = useState("S103");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl bg-green-200 p-4">
        Academic Graph Explorer
      </h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="min-w-0">
          {/* Peer Network */}
          <section className="mb-6 rounded-lg border p-4 sm:p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <label htmlFor="student-select" className="font-semibold">
                Select Student ID:
              </label>

              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger
                  id="student-select"
                  className="w-full sm:w-[220px]"
                >
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="S101">S101 (Michael)</SelectItem>
                  <SelectItem value="S102">S102 (Anna)</SelectItem>
                  <SelectItem value="S103">S103 (John)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prevent graph from overflowing the screen */}
            <div className="w-full overflow-x-auto">
              <PeerNetwork studentId={studentId} />
            </div>
          </section>

          {/* Prerequisite Chain */}
          <section className="mb-6 rounded-lg border p-4 sm:p-5">
            <h2 className="mb-5 text-xl font-bold sm:text-2xl">
              Prerequisite Chain
            </h2>

            <div className="w-full overflow-x-auto">
              <PrerequisiteChain />
            </div>
          </section>
        </div>

        {/* Subjects */}
        <section className="min-w-0">
          <h2 className="mb-5 text-xl font-bold sm:text-2xl">All Subjects & Prerequisites</h2>

          <div className="w-full overflow-x-auto">
            <SubjectList />
          </div>
        </section>
      </div>
    </div>
  );
}
