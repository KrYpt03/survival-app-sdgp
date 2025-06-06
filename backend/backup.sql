--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AlertType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AlertType" AS ENUM (
    'OUT_OF_RANGE',
    'HELP_REQUEST'
);


ALTER TYPE public."AlertType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Alert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Alert" (
    "alertID" text NOT NULL,
    "userID" text NOT NULL,
    "teamID" text NOT NULL,
    type public."AlertType" NOT NULL,
    message text NOT NULL,
    "lastLatitude" double precision NOT NULL,
    "lastLongitude" double precision NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Alert" OWNER TO postgres;

--
-- Name: EmergencyAlert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EmergencyAlert" (
    "alertID" text NOT NULL,
    "userID" text NOT NULL,
    "teamID" text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    message text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EmergencyAlert" OWNER TO postgres;

--
-- Name: Team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Team" (
    "teamID" text NOT NULL,
    "teamName" text NOT NULL,
    "teamCode" text NOT NULL,
    range double precision NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "leaderID" text NOT NULL
);


ALTER TABLE public."Team" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "userID" text NOT NULL,
    "clerkID" text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastLatitude" double precision,
    "lastLongitude" double precision,
    "teamID" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserLocation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserLocation" (
    "locationID" text NOT NULL,
    "userID" text NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    altitude double precision,
    speed double precision,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isSynced" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."UserLocation" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Alert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Alert" ("alertID", "userID", "teamID", type, message, "lastLatitude", "lastLongitude", "timestamp", resolved) FROM stdin;
\.


--
-- Data for Name: EmergencyAlert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EmergencyAlert" ("alertID", "userID", "teamID", latitude, longitude, message, "timestamp") FROM stdin;
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Team" ("teamID", "teamName", "teamCode", range, active, "leaderID") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" ("userID", "clerkID", username, email, "createdAt", "lastLatitude", "lastLongitude", "teamID") FROM stdin;
\.


--
-- Data for Name: UserLocation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserLocation" ("locationID", "userID", latitude, longitude, altitude, speed, "timestamp", "isSynced") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9b1024d2-8b95-496f-afa6-d081cefec3bc	1f011e66428a337b2a5a26813b20c7052d7f12a949a1466825ae9b826e28dba9	2025-03-13 22:29:16.137314+05:30	20250313165916_init_database	\N	\N	2025-03-13 22:29:16.067619+05:30	1
\.


--
-- Name: Alert Alert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_pkey" PRIMARY KEY ("alertID");


--
-- Name: EmergencyAlert EmergencyAlert_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmergencyAlert"
    ADD CONSTRAINT "EmergencyAlert_pkey" PRIMARY KEY ("alertID");


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("teamID");


--
-- Name: UserLocation UserLocation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserLocation"
    ADD CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("locationID");


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Team_leaderID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Team_leaderID_key" ON public."Team" USING btree ("leaderID");


--
-- Name: Team_teamCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Team_teamCode_key" ON public."Team" USING btree ("teamCode");


--
-- Name: User_clerkID_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_clerkID_key" ON public."User" USING btree ("clerkID");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: Alert Alert_teamID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES public."Team"("teamID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Alert Alert_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Alert"
    ADD CONSTRAINT "Alert_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EmergencyAlert EmergencyAlert_teamID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmergencyAlert"
    ADD CONSTRAINT "EmergencyAlert_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES public."Team"("teamID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EmergencyAlert EmergencyAlert_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EmergencyAlert"
    ADD CONSTRAINT "EmergencyAlert_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Team Team_leaderID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_leaderID_fkey" FOREIGN KEY ("leaderID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserLocation UserLocation_userID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserLocation"
    ADD CONSTRAINT "UserLocation_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."User"("userID") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_teamID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES public."Team"("teamID") ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

