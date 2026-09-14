import { useEffect, useState } from "react";

import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  GitBranch,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import "./App.css";

const API = "http://127.0.0.1:8000";

function App() {
  // ==========================================================
  // API STATE
  // ==========================================================

  const [overview, setOverview] = useState(null);
  const [landscape, setLandscape] = useState(null);
  const [trends, setTrends] = useState(null);
  const [intelligence, setIntelligence] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [graphContext, setGraphContext] = useState(null);
  const [mmrEvaluation, setMmrEvaluation] = useState(null);
  const [pipeline, setPipeline] = useState(null);

  // ==========================================================
  // LIVE RECOMMENDATION SEARCH
  // ==========================================================

  const [query, setQuery] = useState(
    "generative AI in higher education"
  );

  const [liveResults, setLiveResults] = useState([]);

  const [searching, setSearching] = useState(false);

  const [searchError, setSearchError] = useState("");

  const [lastQuery, setLastQuery] = useState(
    "generative AI in higher education"
  );

  // ==========================================================
  // LOAD ARI PIPELINE DATA
  // ==========================================================

  useEffect(() => {
    fetch(`${API}/api/overview`)
      .then((response) => response.json())
      .then((data) => setOverview(data))
      .catch((error) =>
        console.error("ARI overview error:", error)
      );

    fetch(`${API}/api/landscape`)
      .then((response) => response.json())
      .then((data) => setLandscape(data))
      .catch((error) =>
        console.error("ARI landscape error:", error)
      );

    fetch(`${API}/api/trends`)
      .then((response) => response.json())
      .then((data) => setTrends(data))
      .catch((error) =>
        console.error("ARI trends error:", error)
      );

    fetch(`${API}/api/intelligence`)
      .then((response) => response.json())
      .then((data) => setIntelligence(data))
      .catch((error) =>
        console.error("ARI intelligence error:", error)
      );

    fetch(`${API}/api/recommendations`)
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);

        setLiveResults(
          (data.recommendations || []).slice(0, 10)
        );
      })
      .catch((error) =>
        console.error("ARI recommendations error:", error)
      );

    fetch(`${API}/api/graph-context`)
      .then((response) => response.json())
      .then((data) => setGraphContext(data))
      .catch((error) =>
        console.error("ARI graph error:", error)
      );

    fetch(`${API}/api/evaluation/mmr`)
      .then((response) => response.json())
      .then((data) => setMmrEvaluation(data))
      .catch((error) =>
        console.error("ARI MMR evaluation error:", error)
      );

    fetch(`${API}/api/pipeline`)
      .then((response) => response.json())
      .then((data) => setPipeline(data))
      .catch((error) =>
        console.error("ARI pipeline error:", error)
      );
  }, []);

  // ==========================================================
  // LIVE RECOMMENDATION SEARCH
  // ==========================================================

  const runRecommendationSearch = async (event) => {
    event?.preventDefault();

    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setSearchError("Please enter a research query.");
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `${API}/api/recommend`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query: cleanQuery,
            top_k: 10,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText ||
            `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      setLiveResults(
        data.recommendations || []
      );

      setLastQuery(
        data.query || cleanQuery
      );
    } catch (error) {
      console.error(
        "ARI live recommendation error:",
        error
      );

      setSearchError(
        "Unable to generate recommendations. Make sure the ARI backend is running."
      );
    } finally {
      setSearching(false);
    }
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  const formatNumber = (value) => {
    if (
      value === undefined ||
      value === null
    ) {
      return "—";
    }

    return Number(value).toLocaleString();
  };

  const formatScore = (value) => {
    if (
      value === undefined ||
      value === null
    ) {
      return "—";
    }

    return Number(value).toFixed(3);
  };

  const formatPercent = (value) => {
    if (
      value === undefined ||
      value === null
    ) {
      return "—";
    }

    return `${Number(value).toFixed(1)}%`;
  };

  const getTrendClass = (value) => {
    if (Number(value) >= 500) {
      return "trend-hot";
    }

    if (Number(value) >= 100) {
      return "trend-high";
    }

    return "trend-steady";
  };

  const getTrendLabel = (value) => {
    if (Number(value) >= 500) {
      return "Rapidly Emerging";
    }

    if (Number(value) >= 100) {
      return "Strong Growth";
    }

    return "Steady Growth";
  };

  // ==========================================================
  // SORT DATA
  // ==========================================================

  const sortedTrends = [
    ...(trends?.trends || []),
  ].sort(
    (a, b) =>
      Number(a.trend_rank) -
      Number(b.trend_rank)
  );

  const topPapers = [
    ...(intelligence?.top_papers || []),
  ].slice(0, 5);

  const graphRecords = [
    ...(graphContext?.records || []),
  ].slice(0, 5);

  const evaluationResults =
    mmrEvaluation?.results || [];

  const getEvaluationValue = (
    metricName
  ) => {
    const item =
      evaluationResults.find(
        (result) =>
          result.metric === metricName
      );

    return item?.value;
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="app">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="navbar">

        <div className="nav-inner">

          <div className="brand">

            <div className="brand-mark">
              <BrainCircuit size={22} />
            </div>

            <div>

              <div className="brand-name">
                ARI
              </div>

              <div className="brand-subtitle">
                Autonomous Research Intelligence
              </div>

            </div>

          </div>

          <nav className="nav-links">

            <a href="#landscape">
              Landscape
            </a>

            <a href="#trends">
              Trends
            </a>

            <a href="#intelligence">
              Intelligence
            </a>

            <a href="#recommendations">
              Recommendations
            </a>

            <a href="#methodology">
              Methodology
            </a>

          </nav>

          <div className="pipeline-status">

            <span className="status-dot"></span>

            {pipeline?.status === "ready"
              ? "Pipeline Ready"
              : "Loading Pipeline"}

          </div>

        </div>

      </header>

      <main>

        {/* =====================================================
            HERO
        ====================================================== */}

        <section className="hero">

          <div className="hero-grid"></div>

          <div className="hero-content">

            <div className="eyebrow">

              <Sparkles size={15} />

              Research Intelligence Engine

            </div>

            <h1>

              Turn research data
              <br />

              <span>
                into intelligence.
              </span>

            </h1>

            <p className="hero-description">

              ARI transforms large-scale academic
              literature into structured research
              intelligence — discovering topics,
              detecting emerging trends, ranking
              important papers, and generating
              context-aware recommendations.

            </p>

            <div className="hero-actions">

              <a
                href="#landscape"
                className="primary-button"
              >

                Explore Research

                <ArrowRight size={17} />

              </a>

              <a
                href="#methodology"
                className="secondary-button"
              >

                View Methodology

              </a>

            </div>

            <div className="hero-source">

              <span className="source-dot"></span>

              Semantic Scholar research corpus

              <span className="source-divider">
                •
              </span>

              2018–2026

            </div>

          </div>

        </section>

        {/* =====================================================
            OVERVIEW METRICS
        ====================================================== */}

        <section className="metrics-section">

          <div className="metrics-grid">

            <Metric
              value={formatNumber(
                overview?.papers
              )}
              label="Research Papers"
            />

            <Metric
              value={formatNumber(
                overview?.topics
              )}
              label="Research Topics"
            />

            <Metric
              value={`${overview?.embedding_dimension || 384}D`}
              label="Semantic Embeddings"
            />

            <Metric
              value={formatNumber(
                overview?.knowledge_graph_nodes
              )}
              label="Knowledge Graph Nodes"
            />

            <Metric
              value={formatNumber(
                overview?.knowledge_graph_edges
              )}
              label="Graph Relationships"
            />

            <Metric
              value={formatNumber(
                overview?.pipeline_stages
              )}
              label="Pipeline Stages"
            />

          </div>

        </section>

        {/* =====================================================
            PIPELINE
        ====================================================== */}

        <section className="section pipeline-section">

          <SectionHeading
            eyebrow="SYSTEM ARCHITECTURE"
            title="From raw literature to research intelligence"
            description="A complete data-to-intelligence pipeline combining NLP, semantic learning, clustering, graph analysis, ranking, and recommendation."
          />

          <div className="pipeline-grid">

            <PipelineStep
              number="01"
              icon={<Database size={20} />}
              title="Collect"
              text="Academic literature ingestion"
            />

            <PipelineStep
              number="02"
              icon={<Search size={20} />}
              title="Process"
              text="Cleaning and semantic preparation"
            />

            <PipelineStep
              number="03"
              icon={<BarChart3 size={20} />}
              title="Represent"
              text="TF-IDF and semantic embeddings"
            />

            <PipelineStep
              number="04"
              icon={<GitBranch size={20} />}
              title="Discover"
              text="Research topic clustering"
            />

            <PipelineStep
              number="05"
              icon={<TrendingUp size={20} />}
              title="Detect"
              text="Emerging research trends"
            />

            <PipelineStep
              number="06"
              icon={<BrainCircuit size={20} />}
              title="Rank"
              text="Research intelligence scoring"
            />

            <PipelineStep
              number="07"
              icon={<Network size={20} />}
              title="Connect"
              text="Knowledge graph context"
            />

            <PipelineStep
              number="08"
              icon={<Sparkles size={20} />}
              title="Recommend"
              text="Semantic + diverse retrieval"
            />

          </div>

        </section>

        {/* =====================================================
            RESEARCH LANDSCAPE
        ====================================================== */}

        <section
          className="section landscape-section"
          id="landscape"
        >

          <SectionHeading
            eyebrow="RESEARCH LANDSCAPE"
            title="Five major research clusters"
            description="Semantic clustering reveals the dominant research areas represented in the corpus."
          />

          <div className="topic-grid">

            {landscape?.topics?.map(
              (topic) => (

                <TopicCard
                  key={topic.cluster}
                  cluster={topic.cluster}
                  title={topic.title}
                  papers={formatNumber(
                    topic.papers
                  )}
                  percentage={`${topic.percentage}%`}
                />

              )
            )}

            {!landscape && (
              <LoadingCard />
            )}

          </div>

        </section>

        {/* =====================================================
            EMERGING TRENDS
        ====================================================== */}

        <section
          className="section trends-section"
          id="trends"
        >

          <SectionHeading
            eyebrow="EMERGING TRENDS"
            title="Where research momentum is accelerating"
            description="Trend scores combine historical growth, recent growth, research share, citation signals, and emergence to identify rapidly developing areas."
          />

          <div className="trends-layout">

            <div className="trends-main">

              {sortedTrends.map(
                (trend) => (

                  <TrendCard
                    key={trend.cluster}
                    trend={trend}
                    rank={trend.trend_rank}
                    formatPercent={
                      formatPercent
                    }
                    getTrendClass={
                      getTrendClass
                    }
                    getTrendLabel={
                      getTrendLabel
                    }
                  />

                )
              )}

              {!trends && (
                <LoadingCard />
              )}

            </div>

            <div className="trend-summary">

              <div className="summary-card">

                <div className="summary-icon">
                  <Zap size={19} />
                </div>

                <span className="summary-label">
                  TOP EMERGING AREA
                </span>

                <h3>
                  {sortedTrends[0]?.topic ||
                    "Loading..."}
                </h3>

                <div className="summary-score">

                  {formatScore(
                    sortedTrends[0]
                      ?.emerging_score
                  )}

                </div>

                <p>
                  Highest emergence score across
                  the research landscape.
                </p>

              </div>

              <div className="summary-card compact">

                <div className="summary-icon">
                  <TrendingUp size={19} />
                </div>

                <span className="summary-label">
                  LATEST COMPLETE YEAR
                </span>

                <h3>
                  {sortedTrends[0]
                    ?.latest_complete_year ||
                    "—"}
                </h3>

                <p>
                  Trend calculations use complete
                  annual research data.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RESEARCH INTELLIGENCE
        ====================================================== */}

        <section
          className="section intelligence-section"
          id="intelligence"
        >

          <div className="intelligence-layout">

            <div className="intelligence-copy">

              <div className="section-eyebrow">
                RESEARCH INTELLIGENCE
              </div>

              <h2>
                Not every paper is equally important.
              </h2>

              <p>
                ARI combines recency, age-aware citation
                impact, topic emergence, and semantic
                quality to prioritize research that
                matters now.
              </p>

              <div className="intelligence-features">

                <Feature
                  icon={
                    <TrendingUp size={18} />
                  }
                  title="Emergence"
                  text="Identifies rapidly growing research areas."
                />

                <Feature
                  icon={
                    <BarChart3 size={18} />
                  }
                  title="Citation Impact"
                  text="Accounts for citation influence relative to paper age."
                />

                <Feature
                  icon={
                    <ShieldCheck size={18} />
                  }
                  title="Quality"
                  text="Uses document length and semantic completeness signals."
                />

              </div>

            </div>

            <div className="intelligence-score-card">

              <div className="score-card-header">

                <span>
                  TOP RESEARCH PAPER
                </span>

                <div className="score-badge">
                  RANK #1
                </div>

              </div>

              {topPapers.length > 0 ? (

                <>

                  <div className="big-score">

                    {formatScore(
                      topPapers[0]
                        ?.intelligence_score
                    )}

                  </div>

                  <div className="top-paper-title">
                    {topPapers[0]?.title}
                  </div>

                  <div className="score-line">

                    <div
                      className="score-fill"
                      style={{
                        width: `${
                          Number(
                            topPapers[0]
                              ?.intelligence_score ||
                              0
                          ) * 100
                        }%`,
                      }}
                    ></div>

                  </div>

                  <div className="score-meta">

                    <span>
                      Year
                    </span>

                    <strong>
                      {topPapers[0]?.year}
                    </strong>

                  </div>

                  <div className="score-meta">

                    <span>
                      Citations
                    </span>

                    <strong>
                      {formatNumber(
                        topPapers[0]
                          ?.citationCount
                      )}
                    </strong>

                  </div>

                  <div className="score-meta">

                    <span>
                      Topic
                    </span>

                    <strong>
                      {topPapers[0]?.topic}
                    </strong>

                  </div>

                </>

              ) : (

                <LoadingCard />

              )}

            </div>

          </div>

          <div className="intelligence-papers">

            <div className="subsection-label">
              TOP INTELLIGENCE-RANKED PAPERS
            </div>

            {topPapers.slice(0, 5).map(
              (paper, index) => (

                <div
                  className="intelligence-paper"
                  key={
                    paper.title ||
                    index
                  }
                >

                  <div className="paper-rank">
                    #{paper.intelligence_rank}
                  </div>

                  <div className="paper-info">

                    <span>
                      {paper.topic}
                    </span>

                    <h3>
                      {paper.title}
                    </h3>

                  </div>

                  <div className="paper-citation">

                    <strong>
                      {formatNumber(
                        paper.citationCount
                      )}
                    </strong>

                    <span>
                      citations
                    </span>

                  </div>

                  <div className="paper-score">

                    {formatScore(
                      paper.intelligence_score
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =====================================================
            KNOWLEDGE GRAPH
        ====================================================== */}

        <section className="section graph-section">

          <SectionHeading
            eyebrow="KNOWLEDGE GRAPH"
            title="Research is a network, not a list."
            description="ARI connects papers, authors, topics, and venues into a structured research knowledge graph."
          />

          <div className="graph-stats">

            <GraphStat
              value={formatNumber(
                overview?.knowledge_graph_nodes
              )}
              label="Graph Nodes"
            />

            <GraphStat
              value={formatNumber(
                graphContext
                  ?.graph_statistics
                  ?.authors ||
                  graphContext
                    ?.author_nodes ||
                  44256
              )}
              label="Author Nodes"
            />

            <GraphStat
              value={formatNumber(
                overview?.topics
              )}
              label="Topic Nodes"
            />

            <GraphStat
              value={formatNumber(
                graphContext
                  ?.graph_statistics
                  ?.venues ||
                  graphContext
                    ?.venue_nodes ||
                  5060
              )}
              label="Venue Nodes"
            />

            <GraphStat
              value={formatNumber(
                overview?.knowledge_graph_edges
              )}
              label="Relationships"
            />

          </div>

          <div className="graph-visual">

            <div className="graph-center">

              <Network size={30} />

              <span>
                Research
                <br />
                Knowledge Graph
              </span>

            </div>

            <div className="graph-node node-one">
              Papers
            </div>

            <div className="graph-node node-two">
              Authors
            </div>

            <div className="graph-node node-three">
              Topics
            </div>

            <div className="graph-node node-four">
              Venues
            </div>

          </div>

          <div className="graph-context">

            <div className="subsection-label">
              RECOMMENDATION GRAPH CONTEXT
            </div>

            {graphRecords.map(
              (record, index) => (

                <div
                  className="graph-context-card"
                  key={
                    record.paperId ||
                    index
                  }
                >

                  <div className="graph-context-rank">
                    #{record.recommendation_rank}
                  </div>

                  <div className="graph-context-info">

                    <h3>
                      {record.title}
                    </h3>

                    <div className="graph-tags">

                      <span>
                        {record.author_count || 0}{" "}
                        authors
                      </span>

                      <span>
                        {record.coauthor_count || 0}{" "}
                        coauthors
                      </span>

                      <span>
                        degree{" "}
                        {record.graph_degree || 0}
                      </span>

                    </div>

                  </div>

                  <div className="graph-context-score">

                    <strong>
                      {formatScore(
                        record.recommendation_score
                      )}
                    </strong>

                    <span>
                      recommendation
                    </span>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

        {/* =====================================================
            LIVE RECOMMENDATIONS
        ====================================================== */}

        <section
          className="section recommendation-section"
          id="recommendations"
        >

          <SectionHeading
            eyebrow="RECOMMENDATION ENGINE"
            title="Find research with context."
            description="Semantic retrieval identifies relevant papers, intelligence ranking prioritizes them, and diversity reranking reduces repetitive results."
          />

          <div className="recommendation-demo">

            <form
              className="query-box"
              onSubmit={
                runRecommendationSearch
              }
            >

              <Search size={19} />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                placeholder="Search a research topic..."
                aria-label="Research query"
                disabled={searching}
              />

              <button
                type="submit"
                disabled={searching}
              >

                {searching
                  ? "Searching..."
                  : "Search"}

                <ArrowRight size={15} />

              </button>

            </form>

            <div className="live-query-label">

              {searching
                ? "ARI is generating live recommendations..."
                : `Showing recommendations for: ${lastQuery}`}

            </div>

            {searchError && (

              <div className="search-error">
                {searchError}
              </div>

            )}

            {liveResults.map(
              (recommendation, index) => (

                <RecommendationCard
                  key={
                    recommendation.paperId ||
                    index
                  }
                  recommendation={
                    recommendation
                  }
                  index={index}
                  formatScore={
                    formatScore
                  }
                  formatNumber={
                    formatNumber
                  }
                />

              )
            )}

            {!recommendations &&
              liveResults.length === 0 && (
                <LoadingCard />
              )}

            {!searching &&
              recommendations &&
              liveResults.length === 0 && (

                <div className="loading-card">
                  No recommendations found.
                </div>

              )}

          </div>

        </section>

        {/* =====================================================
            EVALUATION
        ====================================================== */}

        <section className="section evaluation-section">

          <SectionHeading
            eyebrow="EVALUATION"
            title="Measured, not just demonstrated."
            description="ARI evaluates recommendation ranking, semantic similarity, diversity, and structural validity."
          />

          <div className="evaluation-grid">

            <EvaluationCard
              value={formatScore(
                getEvaluationValue(
                  "mean_recommendation_score"
                )
              )}
              label="Mean Recommendation Score"
              description="Top-10 MMR results"
            />

            <EvaluationCard
              value={formatScore(
                getEvaluationValue(
                  "mean_mmr_score"
                )
              )}
              label="Mean MMR Score"
              description="Relevance-diversity objective"
            />

            <EvaluationCard
              value={formatScore(
                getEvaluationValue(
                  "mean_semantic_similarity"
                )
              )}
              label="Semantic Similarity"
              description="Recommendation relevance"
            />

            <EvaluationCard
              value={formatScore(
                getEvaluationValue(
                  "semantic_diversity_score"
                )
              )}
              label="Recommendation Diversity"
              description="1 − pairwise similarity"
            />

          </div>

          <div className="evaluation-secondary">

            <EvaluationMini
              value={formatScore(
                getEvaluationValue(
                  "mean_pairwise_semantic_similarity"
                )
              )}
              label="Mean Pairwise Similarity"
            />

            <EvaluationMini
              value={formatNumber(
                getEvaluationValue(
                  "unique_clusters"
                )
              )}
              label="Unique Clusters"
            />

            <EvaluationMini
              value={
                getEvaluationValue(
                  "ranking_order_valid"
                ) === 1
                  ? "VALID"
                  : "CHECK"
              }
              label="Ranking Order"
            />

            <EvaluationMini
              value={formatNumber(
                getEvaluationValue(
                  "recommendation_count"
                )
              )}
              label="Evaluated Recommendations"
            />

          </div>

        </section>

        {/* =====================================================
            METHODOLOGY
        ====================================================== */}

        <section
          className="section methodology-section"
          id="methodology"
        >

          <SectionHeading
            eyebrow="METHODOLOGY"
            title="Built as a real DSAI pipeline."
            description="The system combines classical information retrieval, modern semantic representation, unsupervised learning, graph analytics, and multi-stage ranking."
          />

          <div className="methodology-grid">

            <MethodCard
              number="01"
              title="Representation"
              text="TF-IDF and MiniLM semantic embeddings transform research text into machine-readable representations."
            />

            <MethodCard
              number="02"
              title="Unsupervised Discovery"
              text="K-Means clustering discovers broad research themes without requiring manually labelled training data."
            />

            <MethodCard
              number="03"
              title="Trend Intelligence"
              text="Historical growth and recent momentum are combined into an emerging research score."
            />

            <MethodCard
              number="04"
              title="Multi-Stage Ranking"
              text="Semantic relevance is combined with research intelligence and citation signals before MMR reranking."
            />

          </div>

          <div className="pipeline-output">

            <div className="subsection-label">
              PIPELINE OUTPUT STATUS
            </div>

            {pipeline?.outputs &&
              Object.entries(
                pipeline.outputs
              ).map(
                ([name, output]) => (

                  <div
                    className="pipeline-output-row"
                    key={name}
                  >

                    <div>

                      {output.available ? (
                        <CheckCircle2
                          size={16}
                        />
                      ) : (
                        <Zap size={16} />
                      )}

                    </div>

                    <span>
                      {name.replace(
                        /_/g,
                        " "
                      )}
                    </span>

                    <strong
                      className={
                        output.available
                          ? "output-ready"
                          : "output-missing"
                      }
                    >

                      {output.available
                        ? "READY"
                        : "MISSING"}

                    </strong>

                  </div>

                )
              )}

          </div>

        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="footer">

          <div className="footer-brand">

            <div className="brand-mark">
              <BrainCircuit size={21} />
            </div>

            <div>

              <strong>
                ARI
              </strong>

              <span>
                Autonomous Research Intelligence
              </span>

            </div>

          </div>

          <div className="footer-right">

            <span>
              Built as a DSAI research project
            </span>

            <span className="footer-divider">
              •
            </span>

            <span>
              2026
            </span>

          </div>

        </footer>

      </main>

    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

function Metric({
  value,
  label,
}) {
  return (
    <div className="metric-card">

      <div className="metric-value">
        {value}
      </div>

      <div className="metric-label">
        {label}
      </div>

    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="section-heading">

      <div className="section-eyebrow">
        {eyebrow}
      </div>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

    </div>
  );
}

function PipelineStep({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="pipeline-step">

      <div className="pipeline-number">
        {number}
      </div>

      <div className="pipeline-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}

function TopicCard({
  cluster,
  title,
  papers,
  percentage,
}) {
  return (
    <div className="topic-card">

      <div className="topic-top">

        <span className="topic-cluster">
          CLUSTER{" "}
          {String(cluster).padStart(2, "0")}
        </span>

        <span className="topic-percentage">
          {percentage}
        </span>

      </div>

      <h3>
        {title}
      </h3>

      <div className="topic-bottom">

        <span>
          {papers} papers
        </span>

        <ArrowRight size={16} />

      </div>

    </div>
  );
}

function TrendCard({
  trend,
  rank,
  formatPercent,
  getTrendClass,
  getTrendLabel,
}) {
  const growth = Number(
    trend.overall_growth_percent || 0
  );

  const recentGrowth = Number(
    trend.recent_growth_percent || 0
  );

  const emergence = Number(
    trend.emerging_score || 0
  );

  const barWidth = Math.min(
    Math.max(
      Math.log10(
        Math.max(growth, 1) + 1
      ) * 30,
      6
    ),
    100
  );

  return (
    <div className="trend-card">

      <div className="trend-rank">
        #{rank}
      </div>

      <div className="trend-content">

        <div className="trend-header">

          <div>

            <span className="trend-topic">
              {trend.topic}
            </span>

            <div className="trend-status">

              <span
                className={`trend-status-dot ${getTrendClass(
                  growth
                )}`}
              ></span>

              {getTrendLabel(growth)}

            </div>

          </div>

          <div className="emergence-score">

            <span>
              Emergence
            </span>

            <strong>
              {emergence.toFixed(3)}
            </strong>

          </div>

        </div>

        <div className="trend-bar-area">

          <div className="trend-bar-label">

            <span>
              Historical growth
            </span>

            <strong>
              {formatPercent(growth)}
            </strong>

          </div>

          <div className="trend-bar">

            <div
              className={`trend-bar-fill ${getTrendClass(
                growth
              )}`}
              style={{
                width: `${barWidth}%`,
              }}
            ></div>

          </div>

        </div>

        <div className="trend-metrics">

          <div>

            <span>
              Latest year
            </span>

            <strong>
              {trend.latest_complete_year}
            </strong>

          </div>

          <div>

            <span>
              Latest papers
            </span>

            <strong>
              {Number(
                trend.latest_year_papers || 0
              ).toLocaleString()}
            </strong>

          </div>

          <div>

            <span>
              Recent growth
            </span>

            <strong>
              {formatPercent(recentGrowth)}
            </strong>

          </div>

          <div>

            <span>
              Research share
            </span>

            <strong>
              {formatPercent(
                trend.latest_year_share_percent
              )}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <div>

        <h4>
          {title}
        </h4>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}

function GraphStat({
  value,
  label,
}) {
  return (
    <div className="graph-stat">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}

function RecommendationCard({
  recommendation,
  index,
  formatScore,
  formatNumber,
}) {
  return (
    <div className="recommendation-result">

      <div className="result-rank">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="result-content">

        <span className="result-topic">
          {recommendation.topic ||
            "RESEARCH"}
        </span>

        <h3>
          {recommendation.title}
        </h3>

        <p>

          {formatNumber(
            recommendation.citationCount
          )}{" "}
          citations
          {" • "}
          {recommendation.year}
          {" • "}
          {recommendation.semantic_quality ||
            "Semantic match"}

        </p>

      </div>

      <div className="result-score">

        <span>
          MMR
        </span>

        <strong>
          {formatScore(
            recommendation.mmr_score
          )}
        </strong>

      </div>

    </div>
  );
}

function EvaluationCard({
  value,
  label,
  description,
}) {
  return (
    <div className="evaluation-card">

      <strong>
        {value}
      </strong>

      <h3>
        {label}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}

function EvaluationMini({
  value,
  label,
}) {
  return (
    <div className="evaluation-mini">

      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>

    </div>
  );
}

function MethodCard({
  number,
  title,
  text,
}) {
  return (
    <div className="method-card">

      <span className="method-number">
        {number}
      </span>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}

function LoadingCard() {
  return (
    <div className="loading-card">

      <TrendingUp size={19} />

      Loading ARI pipeline data...

    </div>
  );
}

export default App;