from pydantic import BaseModel


class ReportRequest(BaseModel):
    prediction_id: str
    include_shap: bool = True
    include_career_recs: bool = True
