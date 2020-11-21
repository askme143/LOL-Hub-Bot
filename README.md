# 롤허브 봇

[디스코드](https://discord.com/)의 리그오브레전드 전적검색 및 커뮤니케이션 도우미, 롤허브 봇입니다.

Node.js의 module, [Discord.js](https://discord.js.org/)를 사용했습니다.

링크를 통해 [채팅 서버에 추가](https://bit.ly/34kQbnw)하실 수 있습니다.

## 기능

1. 소환사 전적검색

   - 솔로랭크 / 자유랭크 티어
   - 시즌 모스트 3 챔피언의 승률, 게임 수, KDA
   - 최근 솔로랭크 20판의 승률 및 KDA
   - 전적검색 예시

     ![hide_on_bush_search](/public/readme/example1.PNG)

## 명령어/사용법

q를 앞에 붙이고 명령어를 입력해주세요. (ex. qping, qq hide on bush)

### 명령어 목록

- q(Query)

  소환사 전적검색 명령어입니다. 띄어쓰기 후 소환사명을 입력해주세요!

  ```
  예시: qq hide on bush
  ```

  ![hide_on_bush_search](/public/readme/example1.PNG)

- ping

  서버의 ping을 반환합니다.

  ```
  예시: qping
  ```

- uptime

  서버의 uptime (켜져있던 시간)을 반환합니다.

  ```
  예시: quptime
  ```

## 기타

- 전적 검색 방식

  전적 검색은 현재 [op.gg](https://www.op.gg/)에서 크롤링하는 방식입니다. 향후 [Riot API](https://developer.riotgames.com/) 승인을 받은 후 Riot API를 이용할 예정입니다.
