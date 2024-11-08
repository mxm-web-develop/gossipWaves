import requests

# 币安 API 基础 URL
BASE_URL = "https://api.binance.com"


# 获取所有交易对的最新价格
def get_all_prices():
    url = f"{BASE_URL}/api/v3/ticker/price"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(
            f"Error fetching prices: {response.status_code}, {response.text}"
        )


def get_market_data():
    url = "https://api.coingecko.com/api/v3/global"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(
            f"Error fetching market data: {response.status_code}, {response.text}"
        )


def get_price_in_usd(symbol):
    url = f"{BASE_URL}/api/v3/ticker/price"
    response = requests.get(url, params={"symbol": symbol})
    if response.status_code == 200:
        price_data = response.json()
        return float(price_data["price"])
    else:
        raise Exception(
            f"Error fetching price: {response.status_code}, {response.text}"
        )


# # 示例用法
# try:
#     # 获取 BTC 对 USDT 的价格（即美元价格）
#     btc_price_usd = get_price_in_usd("BTCUSDT")
#     print("BTC 价格 (USD):", btc_price_usd)

#     # 获取 ETH 对 USDT 的价格（即美元价格）
#     eth_price_usd = get_price_in_usd("ETHUSDT")
#     print("ETH 价格 (USD):", eth_price_usd)

# except Exception as e:
#     print("Error:", e)


# 获取特定交易对的 K 线数据
def get_kline_data(symbol, interval, start_time=None, end_time=None, limit=100):
    url = f"{BASE_URL}/api/v3/klines"
    params = {"symbol": symbol, "interval": interval, "limit": limit}
    if start_time:
        params["startTime"] = start_time
    if end_time:
        params["endTime"] = end_time
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "message": response.text}


# 获取市场深度数据
def get_market_depth(symbol, limit=10):
    url = f"{BASE_URL}/api/v3/depth"
    params = {"symbol": symbol, "limit": limit}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "message": response.text}


# 获取24小时内的市场统计数据
def get_24hr_ticker(symbol):
    url = f"{BASE_URL}/api/v3/ticker/24hr"
    params = {"symbol": symbol}
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": response.status_code, "message": response.text}


# print("获取所有交易对的最新价格:", get_market_data())
# print("获取 BTCUSDT 的 1 小时 K 线数据:", get_kline_data("BTCUSDT", "1h", limit=5))
# print("获取 BTCUSDT 的市场深度:", get_market_depth("BTCUSDT"))
# print("获取 BTCUSDT 的 24 小时市场统计数据:", get_24hr_ticker("BTCUSDT"))
