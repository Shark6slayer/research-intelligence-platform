from pathlib import Path
import sys
import math
import sys
from pathlib import Path

import numpy as np
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ============================================================
# ARI PROJECT CONNECTION
# ============================================================

ARI_PROJECT = Path(
    r"C:\autonomous-research-intelligence"
)

ARI_SRC = ARI_PROJECT / "src"

if str(ARI_SRC) not in sys.path:
    sys.path.insert(0, str(ARI_SRC))


# Import the LIVE ARI recommendation engine
from recommendation.live_recommender import recommend  # pyright: ignore[reportMissingImports]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="ARI API",
    description=(
        "API layer for the Autonomous Research Intelligence "
        "pipeline and live research recommendation engine."
    ),
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PIPELINE DATA
# ============================================================

PIPELINE_DIR = (
    ARI_PROJECT
    / "data"
    / "processed"
)


# ============================================================
# REQUEST MODEL
# ============================================================

class RecommendationRequest(BaseModel):

    query: str

    top_k: int = 10


# ============================================================
# HELPERS
# ============================================================

def read_parquet(filename: str) -> pd.DataFrame:

    path = PIPELINE_DIR / filename

    if not path.exists():

        raise FileNotFoundError(
            f"ARI pipeline output not found: {path}"
        )

    return pd.read_parquet(path)


def make_json_safe(value):

    if value is None:
        return None

    if isinstance(value, float):

        if math.isnan(value) or math.isinf(value):
            return None

        return value

    if isinstance(value, np.generic):

        value = value.item()

        if isinstance(value, float):

            if math.isnan(value) or math.isinf(value):
                return None

        return value

    if isinstance(value, np.ndarray):

        return [
            make_json_safe(item)
            for item in value.tolist()
        ]

    if isinstance(value, (list, tuple)):

        return [
            make_json_safe(item)
            for item in value
        ]

    if isinstance(value, dict):

        return {
            str(key): make_json_safe(item)
            for key, item in value.items()
        }

    if isinstance(value, pd.Timestamp):

        return value.isoformat()

    try:

        if pd.isna(value):
            return None

    except (TypeError, ValueError):

        pass

    return value


def dataframe_to_records(
    df: pd.DataFrame
):

    records = df.to_dict(
        orient="records"
    )

    return [

        {
            str(key): make_json_safe(value)

            for key, value in record.items()
        }

        for record in records
    ]


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
def health_check():

    return {

        "status": "ok",

        "service":
            "Autonomous Research Intelligence",

        "version":
            "1.0.0",

        "live_recommendation_engine":
            "connected",
    }


# ============================================================
# PIPELINE STATUS
# ============================================================

@app.get("/api/pipeline")
def get_pipeline_status():

    required_outputs = {

        "clustered_papers":
            "clustered_papers.parquet",

        "research_trends":
            "research_trends.parquet",

        "research_intelligence":
            "research_intelligence.parquet",

        "recommendations":
            "diverse_recommendations.parquet",

        "graph_context":
            "recommendation_graph_context.parquet",

        "mmr_evaluation":
            "mmr_evaluation.parquet",

        "recommendation_comparison":
            "recommendation_comparison.parquet",
    }

    outputs = {}

    for name, filename in required_outputs.items():

        path = PIPELINE_DIR / filename

        outputs[name] = {

            "file":
                filename,

            "available":
                path.exists(),
        }

        if path.exists():

            outputs[name][
                "size_bytes"
            ] = path.stat().st_size

    available_count = sum(

        item["available"]

        for item in outputs.values()
    )

    return {

        "pipeline":
            "Autonomous Research Intelligence",

        "status":
            (
                "ready"

                if available_count ==
                len(required_outputs)

                else "partial"
            ),

        "outputs_available":
            available_count,

        "outputs_expected":
            len(required_outputs),

        "outputs":
            outputs,
    }


# ============================================================
# OVERVIEW
# ============================================================

@app.get("/api/overview")
def get_overview():

    papers = read_parquet(
        "clustered_papers.parquet"
    )

    trends = read_parquet(
        "research_trends.parquet"
    )

    intelligence = read_parquet(
        "research_intelligence.parquet"
    )

    return {

        "papers":
            len(papers),

        "topics":
            int(
                papers["cluster"].nunique()
            ),

        "trends":
            len(trends),

        "intelligence_records":
            len(intelligence),

        "embedding_dimension":
            384,

        "knowledge_graph_nodes":
            60629,

        "knowledge_graph_edges":
            207323,

        "pipeline_stages":
            18,

        "data_source":
            str(PIPELINE_DIR),
    }


# ============================================================
# RESEARCH LANDSCAPE
# ============================================================

@app.get("/api/landscape")
def get_landscape():

    papers = read_parquet(
        "clustered_papers.parquet"
    )

    cluster_names = {

        0:
            "Computer Vision & Deep Learning",

        1:
            "Generative AI & AI in Education",

        2:
            "Data Mining & Machine Learning",

        3:
            "Reinforcement Learning & Control",

        4:
            "Natural Language Processing",
    }

    counts = (
        papers["cluster"]
        .value_counts()
        .sort_index()
    )

    total = len(papers)

    landscape = []

    for cluster_id, count in counts.items():

        landscape.append({

            "cluster":
                int(cluster_id),

            "title":
                cluster_names.get(
                    int(cluster_id),
                    f"Research Cluster {cluster_id}",
                ),

            "papers":
                int(count),

            "percentage":
                round(
                    (count / total) * 100,
                    2,
                ),
        })

    return {

        "total_papers":
            total,

        "topics":
            landscape,
    }


# ============================================================
# TRENDS
# ============================================================

@app.get("/api/trends")
def get_trends():

    trends = read_parquet(
        "research_trends.parquet"
    )

    return {

        "count":
            len(trends),

        "trends":
            dataframe_to_records(
                trends
            ),
    }


# ============================================================
# INTELLIGENCE
# ============================================================

@app.get("/api/intelligence")
def get_intelligence():

    intelligence = read_parquet(
        "research_intelligence.parquet"
    )

    columns = [

        "intelligence_rank",

        "title",

        "year",

        "citationCount",

        "topic",

        "emerging_score",

        "recency_score",

        "citations_per_year",

        "citation_score",

        "topic_emergence_score",

        "quality_score",

        "intelligence_score",
    ]

    available_columns = [

        column

        for column in columns

        if column in intelligence.columns
    ]

    result = intelligence[
        available_columns
    ].copy()

    if "intelligence_rank" in result.columns:

        result = result.sort_values(
            "intelligence_rank"
        )

    return {

        "count":
            len(result),

        "top_papers":
            dataframe_to_records(
                result.head(20)
            ),
    }


# ============================================================
# BATCH RECOMMENDATIONS
# ============================================================

@app.get("/api/recommendations")
def get_recommendations():

    recommendations = read_parquet(
        "diverse_recommendations.parquet"
    )

    return {

        "count":
            len(recommendations),

        "recommendations":
            dataframe_to_records(
                recommendations.head(20)
            ),
    }


# ============================================================
# LIVE RESEARCH RECOMMENDATION
# ============================================================

@app.post("/api/recommend")
def live_recommendation(
    request: RecommendationRequest
):

    query = request.query.strip()

    if not query:

        raise HTTPException(
            status_code=400,
            detail="Research query cannot be empty.",
        )


    if len(query) > 500:

        raise HTTPException(
            status_code=400,
            detail=(
                "Research query must be "
                "500 characters or less."
            ),
        )


    top_k = max(
        1,
        min(
            request.top_k,
            20,
        )
    )


    try:

        results = recommend(

            query=query,

            top_k=top_k,
        )


        return {

            "query":
                query,

            "count":
                len(results),

            "model":
                "all-MiniLM-L6-v2",

            "candidate_pool":
                100,

            "mmr_lambda":
                0.75,

            "recommendations":
                dataframe_to_records(
                    results
                ),
        }


    except Exception as error:

        print(
            "ARI recommendation error:",
            error
        )

        raise HTTPException(

            status_code=500,

            detail=str(error),
        )


# ============================================================
# GRAPH CONTEXT
# ============================================================

@app.get("/api/graph-context")
def get_graph_context():

    graph = read_parquet(
        "recommendation_graph_context.parquet"
    )

    return {

        "count":
            len(graph),

        "records":
            dataframe_to_records(
                graph.head(20)
            ),
    }


# ============================================================
# MMR EVALUATION
# ============================================================

@app.get("/api/evaluation/mmr")
def get_mmr_evaluation():

    evaluation = read_parquet(
        "mmr_evaluation.parquet"
    )

    return {

        "count":
            len(evaluation),

        "results":
            dataframe_to_records(
                evaluation
            ),
    }


# ============================================================
# RECOMMENDATION COMPARISON
# ============================================================

@app.get(
    "/api/evaluation/recommendations"
)
def get_recommendation_evaluation():

    evaluation = read_parquet(
        "recommendation_comparison.parquet"
    )

    return {

        "count":
            len(evaluation),

        "results":
            dataframe_to_records(
                evaluation
            ),
    }