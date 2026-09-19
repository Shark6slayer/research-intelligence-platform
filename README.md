# Research Intelligence Platform

An AI-powered research intelligence and recommendation platform designed to help users discover, analyze, and prioritize academic research.

## Live Demo

**Frontend:**  
https://research-intelligence-platform-lc3t.onrender.com

The React frontend is deployed on Render.

The FastAPI backend is configured for deployment but currently requires a higher-memory runtime because the semantic recommendation engine loads the embedding model and research corpus into memory.

## Overview

Research Intelligence Platform combines semantic search, research-topic clustering, trend detection, research intelligence scoring, knowledge-graph context, and diversity-aware recommendation into an interactive web application.

The platform provides a research dashboard where users can explore research landscapes and submit live research queries to receive ranked academic paper recommendations.

## Key Features

- Semantic research search using Sentence Transformers
- Research topic discovery and clustering
- Emerging research trend detection
- Research intelligence scoring
- Knowledge graph-based research context
- Semantic retrieval and intelligence ranking
- MMR-based diversity reranking
- Live query-based recommendations
- Interactive research analytics dashboard
- REST API powered by FastAPI
- Responsive React frontend

## System Architecture

```text
Research Intelligence Platform
              |
      +-------+-------+
      |               |
React Frontend    FastAPI Backend
                      |
             Research Intelligence
                      |
             Recommendation Engine
                      |
       +--------------+--------------+
       |              |              |
 Semantic Search  Intelligence    MMR Reranking
                  Scoring
       |              |              |
       +--------------+--------------+
                      |
             Academic Research Corpus