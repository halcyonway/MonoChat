import os
import logging

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_silicon_flow_api_key() -> str:
    api_key = os.environ.get("SILICON_FLOW_API_KEY")
    if not api_key:
        logger.error("SILICON_FLOW_API_KEY not found in environment variables")
        return ""
    return api_key 