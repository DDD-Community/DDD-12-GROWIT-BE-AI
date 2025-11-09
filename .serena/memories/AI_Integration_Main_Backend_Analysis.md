# Main Backend (DDD-12-GROWIT-BE) - AI Integration Analysis

## Project Type
- Java Spring Boot Backend (Gradle build system)
- Version: 0.0.3
- Framework: Spring Boot 3.4.5
- Database: PostgreSQL

## Current AI Implementation Status

### Integrated AI Services

1. **ChatGPT/OpenAI Integration**
   - Direct OpenAI API calls via RestTemplate
   - Model: GPT-4o-mini
   - Temperature: 0.3
   - File: `app/src/main/java/com/growit/app/retrospect/infrastructure/engine/ChatGptAIAnalysis.java`
   - Interface: `app/src/main/java/com/growit/app/retrospect/domain/goalretrospect/service/AIAnalysis.java`

2. **Separate AI Mentor Service (Node.js Backend)**
   - Remote AI service for mentor advice and goal recommendations
   - Called via HTTP WebClient
   - Configuration: `ai.mentor.url` property
   - Used by: `AiMentorAdviceClientImpl`

### Key AI Components

1. **Configuration**
   - `AIProperties.java` - Configuration properties class
   - Properties:
     - `ai.api.api-key`: OpenAI API Key
     - `ai.api.baseUrl`: https://api.openai.com
     - `ai.api.model`: gpt-4o-mini
     - `ai.api.temperature`: 0.3
     - `ai.mentor.url`: URL to separate AI Mentor backend

2. **Domain Services & Interfaces**
   - `AIAnalysis.java`: Interface for goal retrospect analysis
   - `AiMentorAdviceClient.java`: Interface for mentor advice and recommendations

3. **Implementation Classes**
   - `ChatGptAIAnalysis.java`: OpenAI chat completions implementation
   - `AiMentorAdviceClientImpl.java`: HTTP client to separate AI backend

## Directory Structure
- `app/src/main/java/com/growit/app/`
  - `ai/` - AI module (currently empty/minimal)
  - `common/config/ai/` - AI configuration
  - `advice/` - Advice domain (uses AI Mentor service)
  - `goal/` - Goal recommendation domain
  - `retrospect/` - Goal retrospect analysis (uses OpenAI)

## AI-Related Files

### Configuration
- `app/src/main/java/com/growit/app/common/config/ai/AIProperties.java`

### Interfaces
- `app/src/main/java/com/growit/app/retrospect/domain/goalretrospect/service/AIAnalysis.java`
- `app/src/main/java/com/growit/app/advice/domain/mentor/service/AiMentorAdviceClient.java`

### Implementations
- `app/src/main/java/com/growit/app/retrospect/infrastructure/engine/ChatGptAIAnalysis.java`
- `app/src/main/java/com/growit/app/advice/infrastructure/client/AiMentorAdviceClientImpl.java`

### Use Cases & Services
- `app/src/main/java/com/growit/app/advice/usecase/GenerateMentorAdviceUseCase.java`
- `app/src/main/java/com/growit/app/goal/usecase/GenerateGoalRecommendationUseCase.java`
- `app/src/main/java/com/growit/app/retrospect/usecase/goalretrospect/CreateGoalRetrospectUseCase.java`
- `app/src/main/java/com/growit/app/advice/domain/mentor/service/MentorAdviceService.java`
- `app/src/main/java/com/growit/app/goal/domain/goalrecommendation/service/GoalRecommendationService.java`

### DTOs
- `app/src/main/java/com/growit/app/advice/usecase/dto/ai/AiMentorAdviceRequest.java`
- `app/src/main/java/com/growit/app/advice/usecase/dto/ai/AiMentorAdviceResponse.java`
- `app/src/main/java/com/growit/app/advice/usecase/dto/ai/AiGoalRecommendationRequest.java`
- `app/src/main/java/com/growit/app/advice/usecase/dto/ai/AiGoalRecommendationResponse.java`

## Build System
- Gradle with Version Catalog (`gradle/libs.versions.toml`)
- No OpenAI client library dependency - using plain HTTP RestTemplate/WebClient
- Key dependencies:
  - Spring Web & WebFlux (for HTTP)
  - Spring Boot Data JPA & Security
  - Lombok
  - Jackson (for JSON)
  - PostgreSQL driver

## Configuration Properties

### Environment Variables Required
- `OPEN_API_KEY`: OpenAI API Key
- `AI_MENTOR_URL`: URL to separate AI Mentor backend

### application.yml
```yaml
ai:
  api:
    api-key: ${OPEN_API_KEY}
  mentor:
    url: ${AI_MENTOR_URL}
```

## Hybrid Architecture
The project uses a **hybrid approach**:
1. **Direct OpenAI Integration**: For goal retrospect analysis using ChatGPT
2. **External AI Service**: Separate Node.js backend for mentor advice and goal recommendations

This suggests a migration path from full REST calls to the separate AI backend.
