import reflex as rx

# 아이콘 정의 (Lucide 대응 없음 → 단순 텍스트 처리)
def nav_icon(label: str):
    return rx.box(
        rx.text(label[0], font_size="sm", color="white"),
        bg="blue.600",
        border_radius="lg",
        width="2em",
        height="2em",
        align_items="center",
        justify_content="center",
        display="flex",
    )

# 각 네비게이션 항목 정의
NAV_ITEMS = [
    {"name": "Builder", "href": "/builder", "desc": "Visual Agent Builder"},
    {"name": "Dashboard", "href": "/dashboard", "desc": "Execution Monitor"},
    {"name": "Marketplace", "href": "/marketplace", "desc": "Agent Store"},
    {"name": "Constitution", "href": "/constitution", "desc": "Rule Manager"},
    {"name": "DAO", "href": "/dao", "desc": "Governance"},
]


def global_navigation() -> rx.Component:
    return rx.box(
        rx.hstack(
            # 로고 부분
            rx.link(
                rx.hstack(
                    nav_icon("S"),
                    rx.vstack(
                        rx.text("Samantha OS", font_weight="bold", font_size="lg"),
                        rx.text("Constitutional AI", font_size="xs", color="gray.500"),
                        spacing="0",
                    )
                ),
                href="/",
            ),

            # 데스크탑 네비게이션
            rx.hstack(
                *[
                    rx.link(
                        rx.hstack(
                            rx.text(item["name"], font_size="sm"),
                            rx.cond(
                                item["name"] == "DAO",
                                rx.badge("Beta", color_scheme="purple", size="xs")
                            )
                        ),
                        href=item["href"],
                        padding_x="2",
                        padding_y="1",
                        border_radius="md",
                        _hover={"bg": "gray.100"},
                    )
                    for item in NAV_ITEMS
                ],
                spacing="2",
                display=["none", "flex"],  # 모바일 숨김
            ),

            # 지갑 연결 (임시 버튼)
            rx.button("Connect Wallet", variant="outline", size="sm"),

            spacing="4",
            justify="space-between",
            align="center",
            width="100%",
        ),
        bg="whiteAlpha.800",
        backdrop_filter="blur(10px)",
        padding="2",
        border_bottom="1px solid #e2e8f0",
        position="sticky",
        top="0",
        z_index="50"
    )
