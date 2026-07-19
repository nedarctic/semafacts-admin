'use client'

import { toast } from "sonner";
import { Form } from "./ui/form";
import { useState, SubmitEvent } from "react";
import { Field, FieldLabel } from "./ui/field";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

/*
model Incident {
  id                String            @id @default(uuid()) @db.Uuid
  companyId         String            @db.Uuid
  incidentIdDisplay String            @unique
  category          String?
  description       String?
  location          String?
  involvedPeople    String?
  incidentDate      String?
  reporterType      ReporterType      @default(Anonymous)
  status            IncidentStatus    @default(New)
  secretCodeHash    String
  deadlineAt        DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  closedAt          DateTime?
  duration          String?
  attachments       Attachment[]
  handlers          IncidentHandler[]
  company           Company           @relation(fields: [companyId], references: [id])
  messages          Message[]
  reporter          Reporter?
  secretCode        SecretCode[]
}
*/

export function CreateIncidentForm() {

    const [description, setDescription] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [involvedPeople, setInvolvedPeople] = useState<string>('');
    const [incidentDate, setIncidentDate] = useState<string>('');
    const [reporterType, setReporterType] = useState<string>('');
    const [duration, setDuration] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);

    const submitHandler = async (e: SubmitEvent) => {
        e.preventDefault();

        try {

            setLoading(true);
            const url = `/api/incidents`;

        } catch (error) {
            toast.error("Service temporarily unavailable. Please try again later.")
        }
    }

    return (
        <Form onSubmit={submitHandler} className="w-full flex flex-col gap-2">
            <Field>
                <FieldLabel>Describe what happened, including dates, locations, and any relevant details.</FieldLabel>
                <Textarea onChange={e => setDescription(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>Where did the incident occur?</FieldLabel>
                <Input onChange={e => setLocation(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>Names, roles, or departments involved (if known)</FieldLabel>
                <Input onChange={e => setInvolvedPeople(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>When did this incident occur?</FieldLabel>
                <Input type="date" onChange={e => setIncidentDate(e.target.value)} />
            </Field>
            <Field>
                <FieldLabel>How long has this occurred?</FieldLabel>
                <Input onChange={e => setDuration(e.target.value)} />
            </Field>
            <Button>Submit</Button>
        </Form>
    );
}