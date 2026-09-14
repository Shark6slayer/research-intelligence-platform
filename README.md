\# Research Intelligence Platform



An AI-powered research intelligence and recommendation platform designed to help users discover, analyze, and prioritize academic research.



\## Overview



Research Intelligence Platform combines semantic search, research-topic clustering, trend detection, research intelligence scoring, knowledge-graph context, and diversity-aware recommendation into an interactive web application.



The platform provides a research dashboard where users can explore research landscapes and submit live research queries to receive ranked academic paper recommendations.



\## Key Features



\- Semantic research search using Sentence Transformers

\- Research topic discovery and clustering

\- Emerging research trend detection

\- Research intelligence scoring

\- Knowledge graph-based research context

\- Semantic retrieval and intelligence ranking

\- MMR-based diversity reranking

\- Live query-based recommendations

\- Interactive research analytics dashboard

\- REST API powered by FastAPI

\- Responsive React frontend



\## System Architecture



```text

&#x20;                   Research Intelligence Platform

&#x20;                              |

&#x20;            +-----------------+-----------------+

&#x20;            |                                   |

&#x20;       React Frontend                      FastAPI Backend

&#x20;            |                                   |

&#x20;            |                          Research Intelligence

&#x20;            |                                   |

&#x20;            +-------------------+---------------+

&#x20;                                |

&#x20;                        Recommendation Engine

&#x20;                                |

&#x20;             +------------------+------------------+

&#x20;             |                  |                  |

&#x20;       Semantic Search    Intelligence Score    MMR Reranking

&#x20;             |                  |                  |

&#x20;             +------------------+------------------+

&#x20;                                |

&#x20;                        Academic Research Corpus







DSAI PIPELINE

Data Collection

&#x20;     ↓

Data Profiling

&#x20;     ↓

Data Preprocessing

&#x20;     ↓

TF-IDF Feature Engineering

&#x20;     ↓

Semantic Embeddings

&#x20;     ↓

Semantic Clustering

&#x20;     ↓

Topic Discovery

&#x20;     ↓

Trend Detection

&#x20;     ↓

Research Intelligence Scoring

&#x20;     ↓

Knowledge Graph Construction

&#x20;     ↓

Semantic Retrieval

&#x20;     ↓

Intelligence Ranking

&#x20;     ↓

MMR Diversity Reranking

&#x20;     ↓

Research Recommendations

